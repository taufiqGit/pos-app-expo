import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  SafeAreaView,
  ScrollView,
} from "react-native";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onPress: () => void;
  badge?: number;
}

export interface SidebarSection {
  title?: string;
  items: SidebarItem[];
}

interface SidebarProps {
  sections: SidebarSection[];
  activeItemId?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  sections,
  activeItemId,
  header,
  footer,
  width = 260,
}) => {
  return (
    <SafeAreaView style={[styles.container, { width }]}>
      {header && <View style={styles.header}>{header}</View>}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            {section.title && (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            {section.items.map((item) => {
              const isActive = item.id === activeItemId;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.item, isActive && styles.activeItem]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  {item.icon && (
                    <View style={styles.iconWrapper}>{item.icon}</View>
                  )}
                  <Text
                    style={[styles.itemLabel, isActive && styles.activeLabel]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {item.badge !== undefined && item.badge > 0 && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {item.badge > 99 ? "99+" : item.badge}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E2E",
    borderRightWidth: 1,
    borderRightColor: "#2E2E3E",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#2E2E3E",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 8,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6B6B8A",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    gap: 12,
  },
  activeItem: {
    backgroundColor: "#3B3BFF22",
  },
  iconWrapper: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  itemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#A0A0B8",
  },
  activeLabel: {
    color: "#7B7BFF",
    fontWeight: "600",
  },
  badge: {
    backgroundColor: "#FF4D4F",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#2E2E3E",
  },
});

export default Sidebar;
