import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { authService } from "../../services/authService";

export default function LoginScreen() {
  const router = useRouter();
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Login form state
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier || !password.trim()) {
      Alert.alert("Validasi", "Identifier dan kata sandi wajib diisi.");
      return;
    }

    try {
      setIsSubmitting(true);
      await authService.login({
        identifier: trimmedIdentifier,
        password,
      });
      router.replace("/select-outlet");
    } catch (error: any) {
      console.error(error, "login error");
      const message =
        error?.message ??
        "Login gagal. Periksa kembali kredensial Anda dan coba lagi.";
      Alert.alert("Login Gagal", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
            </View>
            <View style={styles.gridRow}>
              <View style={styles.gridCell} />
              <View style={styles.gridCell} />
            </View>
          </View>
          <Text style={styles.logoText}>kasheer</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>Masuk</Text>
        <Text style={styles.subtitle}>
          Masuk dengan identifier dan kata sandi Anda
        </Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Identifier <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email / Username / Staff ID"
                placeholderTextColor="#D1D5DB"
                value={identifier}
                onChangeText={setIdentifier}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              Kata Sandi <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrapper}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Kata Sandi"
                placeholderTextColor="#D1D5DB"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me & Forgot Password */}
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Ingat Saya</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.forgotPassword}>Lupa Kata Sandi?</Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              styles.loginButton,
              isSubmitting && styles.loginButtonDisabled,
            ]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>Masuk</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Anda pemilik bisnis?{" "}
            <Text style={styles.footerLink}>Daftar disini</Text>
          </Text>

          <TouchableOpacity style={styles.activationLink} activeOpacity={0.7}>
            <Text style={styles.activationLinkText}>Aktivasi Ulang</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  logoIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  gridRow: {
    flexDirection: "row",
    gap: 3,
    marginBottom: 3,
  },
  gridCell: {
    width: 12,
    height: 12,
    backgroundColor: "#FF6B35",
    borderRadius: 3,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FF6B35",
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#4B5563",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 32,
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
  },
  required: {
    color: "#FF6B35",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1F2937",
    paddingVertical: 0,
  },
  eyeIcon: {
    padding: 4,
    marginLeft: 8,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#FF6B35",
    borderColor: "#FF6B35",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#FF6B35",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#FF6B35",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  loginButtonDisabled: {
    opacity: 0.75,
  },
  footer: {
    alignItems: "center",
    gap: 16,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  footerLink: {
    color: "#FF6B35",
    fontWeight: "600",
  },
  activationLink: {
    paddingVertical: 8,
  },
  activationLinkText: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
});
