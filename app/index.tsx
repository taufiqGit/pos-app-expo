import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const THEME = {
  primary: "#FF3366", // Pinkish Red
  secondary: "#0055FF", // Blue
  success: "#2E7D32", // Green
  successBg: "#E8F5E9",
  background: "#F8F9FA",
  white: "#FFFFFF",
  text: "#1A1A1A",
  textGray: "#666666",
  textLight: "#999999",
  border: "#EEEEEE",
  yellow: "#FFD700",
};

export default function QueueStatusScreen() {
  const [rating, setRating] = useState(4);
  const [review, setReview] = useState("");

  const renderStars = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={32}
              color={star <= rating ? THEME.yellow : "#D1D5DB"}
              style={{ marginHorizontal: 4 }}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar barStyle="dark-content" backgroundColor={THEME.white} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Queue Status</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color={THEME.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Hero Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(500)}
          style={styles.heroSection}
        >
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark" size={40} color={THEME.success} />
          </View>
          <Text style={styles.heroTitle}>All Caught Up!</Text>
          <Text style={styles.heroSubtitle}>
            You have no upcoming appointments. Your last visit was completed
            successfully.
          </Text>
        </Animated.View>

        {/* Last Visit Section */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Last Visit</Text>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>Today, 10:30 AM</Text>
            </View>
          </View>

          <View style={styles.card}>
            {/* Doctor Info */}
            <View style={styles.doctorHeader}>
              <Image
                source={{ uri: "https://i.pravatar.cc/150?u=dr_sarah" }}
                style={styles.avatar}
              />
              <View style={styles.doctorInfo}>
                <Text style={styles.doctorName}>Dr. Sarah Wilson</Text>
                <Text style={styles.doctorSpecialty}>
                  Cardiologist • Heart Care Clinic
                </Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Completed</Text>
              </View>
            </View>

            <View style={styles.divider} />

            {/* Visit Details */}
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="stethoscope"
                    size={16}
                    color={THEME.primary}
                  />
                </View>
                <Text style={styles.detailLabel}>Service</Text>
              </View>
              <Text style={styles.detailValue}>General Checkup</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="currency-usd"
                    size={16}
                    color={THEME.primary}
                  />
                </View>
                <Text style={styles.detailLabel}>Total Fee</Text>
              </View>
              <Text style={styles.detailValue}>$120.00</Text>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons
                    name="file-document-outline"
                    size={16}
                    color={THEME.primary}
                  />
                </View>
                <Text style={styles.detailLabel}>Prescription</Text>
              </View>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.detailValue,
                    { color: THEME.primary, fontWeight: "600" },
                  ]}
                >
                  View PDF
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Feedback Section */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(500)}
          style={styles.feedbackCard}
        >
          <Text style={styles.feedbackTitle}>How was your experience?</Text>
          <Text style={styles.feedbackSubtitle}>
            Your feedback helps us improve.
          </Text>

          {renderStars()}

          <TextInput
            style={styles.input}
            placeholder="Write a note (optional)..."
            placeholderTextColor="#9CA3AF"
            value={review}
            onChangeText={setReview}
            multiline
          />

          <TouchableOpacity style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View
          entering={FadeInDown.delay(400).duration(500)}
          style={styles.actionsContainer}
        >
          <TouchableOpacity style={styles.primaryButton}>
            <MaterialCommunityIcons
              name="calendar-plus"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.primaryButtonText}>Book New Appointment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Return to Home</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation Mockup */}
      <View style={styles.bottomNav}>
        <NavItem icon="ticket-confirmation-outline" label="Queue" active />
        <NavItem icon="magnify" label="Search" />
        <NavItem icon="compass-outline" label="Explore" />
        <NavItem icon="account-outline" label="Profile" />
      </View>
    </SafeAreaView>
  );
}

const NavItem = ({
  icon,
  label,
  active,
}: {
  icon: any;
  label: string;
  active?: boolean;
}) => (
  <TouchableOpacity style={styles.navItem}>
    <MaterialCommunityIcons
      name={icon}
      size={24}
      color={active ? THEME.primary : "#9CA3AF"}
    />
    <Text
      style={[styles.navLabel, { color: active ? THEME.primary : "#9CA3AF" }]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: THEME.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  heroSection: {
    alignItems: "center",
    marginVertical: 24,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: THEME.successBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: THEME.text,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    color: THEME.textGray,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: THEME.text,
  },
  dateBadge: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  dateText: {
    fontSize: 12,
    color: THEME.textGray,
    fontWeight: "600",
  },
  card: {
    backgroundColor: THEME.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: THEME.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  doctorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.text,
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 12,
    color: THEME.textGray,
  },
  statusBadge: {
    backgroundColor: THEME.successBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: THEME.success,
  },
  divider: {
    height: 1,
    backgroundColor: THEME.border,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFF0F5", // Light pink
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: THEME.textGray,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.text,
  },
  feedbackCard: {
    backgroundColor: "#F8F9FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: THEME.text,
    marginBottom: 6,
  },
  feedbackSubtitle: {
    fontSize: 13,
    color: THEME.textGray,
    marginBottom: 20,
  },
  starContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    backgroundColor: THEME.white,
    borderRadius: 12,
    padding: 12,
    height: 50,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 16,
  },
  submitButton: {
    width: "100%",
    backgroundColor: THEME.white,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.text,
  },
  actionsContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: THEME.secondary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  primaryButtonText: {
    color: THEME.white,
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: THEME.white,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  secondaryButtonText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: "600",
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    backgroundColor: THEME.white,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === "ios" ? 30 : 12,
  },
  navItem: {
    alignItems: "center",
  },
  navLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "500",
  },
});
