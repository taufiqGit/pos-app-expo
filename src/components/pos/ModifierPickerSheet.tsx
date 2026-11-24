import * as Haptics from "expo-haptics";
import { X } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { ActivityIndicator, Modal, Pressable, ScrollView, StyleSheet, View } from "react-native";
import Button from "@/components/ui/Button";
import { ThemedText } from "@/components/ui/ThemedText";
import { colors, motion, radius, spacing } from "@/theme";
import {
  fetchProductModifierGroups,
  type ModifierGroup,
  type SelectedModifier,
} from "@/services/modifierService";
import { formatRupiah } from "@/utils/format";

interface ModifierPickerSheetProps {
  productId: string;
  visible: boolean;
  onClose: () => void;
  /** Dipanggil dengan daftar modifier terpilih (bisa kosong) */
  onConfirm: (modifiers: SelectedModifier[]) => void;
}

interface SheetContentProps {
  productId: string;
  onClose: () => void;
  onConfirm: (modifiers: SelectedModifier[]) => void;
}

/**
 * Konten sheet. Diremount tiap dibuka (conditional render di parent)
 * sehingga state pilihan ter-reset otomatis.
 */
function SheetContent({ productId, onClose, onConfirm }: SheetContentProps) {
  const [groups, setGroups] = useState<ModifierGroup[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  /** key = `${groupId}:${optionId}` */
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  React.useEffect(() => {
    let cancelled = false;
    fetchProductModifierGroups(productId)
      .then((list) => {
        if (!cancelled) setGroups(list);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Gagal memuat modifier. Coba lagi.");
      });
    return () => {
      cancelled = true;
    };
  }, [productId]);

  const selections = useMemo(() => {
    const result: SelectedModifier[] = [];
    (groups ?? []).forEach((group) => {
      group.options?.forEach((option) => {
        if (selectedKeys.has(`${group.id}:${option.id}`)) {
          result.push({
            groupId: group.id,
            groupName: group.name,
            optionId: option.id,
            optionName: option.name,
            price: option.price ?? 0,
          });
        }
      });
    });
    return result;
  }, [groups, selectedKeys]);

  const modifiersTotal = selections.reduce((sum, m) => sum + m.price, 0);

  /** Validasi tiap grup: required/min_select harus terpenuhi */
  const unmetGroups = useMemo(() => {
    if (!groups) return [] as string[];
    return groups
      .filter((group) => {
        const count = selections.filter((m) => m.groupId === group.id).length;
        const min = group.is_required ? Math.max(1, group.min_select) : group.min_select;
        return min > 0 && count < min;
      })
      .map((group) => group.name);
  }, [groups, selections]);

  const toggle = (group: ModifierGroup, optionId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const key = `${group.id}:${optionId}`;
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
        return next;
      }
      // Hormati max_select grup (0 / undefined = bebas)
      const countInGroup = selections.filter((m) => m.groupId === group.id).length;
      const max = group.max_select ?? 0;
      if (max > 0 && countInGroup >= max && !next.has(key)) {
        return prev;
      }
      next.add(key);
      return next;
    });
  };

  const handleConfirm = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onConfirm(selections);
    onClose();
  };

  if (loadError) {
    return (
      <View style={styles.centerWrap}>
        <ThemedText variant="sm" color="textSecondary">
          {loadError}
        </ThemedText>
        <Button label="Tutup" variant="ghost" size="md" onPress={onClose} />
      </View>
    );
  }

  if (!groups) {
    return (
      <View style={styles.centerWrap}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <>
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <ThemedText variant="base" weight="bold" color="ink" numberOfLines={1}>
            Pilih Modifier
          </ThemedText>
          <ThemedText variant="micro" color="textSecondary">
            Sesuaikan pesanan kamu
          </ThemedText>
        </View>
        <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel="Tutup" style={styles.closeButton}>
          <X size={18} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {groups.map((group) => {
          const countInGroup = selections.filter((m) => m.groupId === group.id).length;
          const max = group.max_select ?? 0;
          return (
            <View key={group.id} style={styles.groupSection}>
              <View style={styles.groupHeader}>
                <ThemedText variant="sm" weight="bold" color="ink">
                  {group.name}
                </ThemedText>
                <ThemedText variant="micro" color="textSecondary">
                  {group.is_required || group.min_select > 0
                    ? `Wajib pilih${group.min_select > 1 ? ` min. ${group.min_select}` : ""}`
                    : "Opsional"}
                  {max > 0 ? ` • maks ${max}` : ""}
                </ThemedText>
              </View>
              {group.options?.filter((option) => option.is_active !== false).map((option) => {
                const active = selectedKeys.has(`${group.id}:${option.id}`);
                const disabled = !active && max > 0 && countInGroup >= max;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => toggle(group, option.id)}
                    disabled={disabled}
                    accessibilityRole="checkbox"
                    accessibilityLabel={option.name}
                    accessibilityState={{ selected: active, disabled }}
                    style={({ pressed }) => [
                      styles.optionRow,
                      active && styles.optionRowActive,
                      (pressed || disabled) && styles.pressed,
                    ]}
                  >
                    <ThemedText variant="sm" weight="semiBold" color={active ? "primary" : "ink"}>
                      {option.name}
                    </ThemedText>
                    <ThemedText variant="sm" weight="bold" color={active ? "primary" : "textSecondary"}>
                      {option.price > 0 ? `+${formatRupiah(option.price)}` : "Gratis"}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <ThemedText variant="micro" color="textSecondary">
            Modifier
          </ThemedText>
          <ThemedText variant="sm" weight="bold" color="ink">
            {modifiersTotal > 0 ? `+${formatRupiah(modifiersTotal)}` : formatRupiah(0)}
          </ThemedText>
        </View>
        <Button
          label="Konfirmasi"
          variant="primary"
          size="md"
          disabled={unmetGroups.length > 0}
          onPress={handleConfirm}
        />
      </View>
    </>
  );
}

export function ModifierPickerSheet({ productId, visible, onClose, onConfirm }: ModifierPickerSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.backdropTouch} onPress={onClose} accessibilityLabel="Tutup" />
        <View style={styles.sheet}>
          {visible ? <SheetContent productId={productId} onClose={onClose} onConfirm={onConfirm} /> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropTouch: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    maxHeight: "85%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.line,
  },
  headerInfo: {
    flex: 1,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  groupSection: {
    gap: spacing.sm,
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.card,
    borderRadius: radius.card,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: colors.bg,
  },
  optionRowActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.line,
  },
  centerWrap: {
    padding: spacing.xxxl,
    gap: spacing.lg,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: motion.pressScale }],
  },
});
