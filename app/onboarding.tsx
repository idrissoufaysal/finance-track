import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header: 01 / 03 + Progress Bar + Skip */}
      <View style={styles.topHeader}>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>01 / 03</Text>
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>
        </View>

        <Pressable onPress={() => router.replace("/(tabs)")} hitSlop={8}>
          <Text style={styles.skipText}>Passer</Text>
        </Pressable>
      </View>

      {/* Main Title & Subtitle */}
      <View style={styles.heroTextContainer}>
        <Text style={styles.heroTitle}>Vos finances</Text>
        <Text style={styles.heroTitle}>En toute sérénité</Text>
        <Text style={styles.heroSubtitle}>
          Suivez vos dépenses, maîtrisez vos budgets et épargnez en FCFA.
        </Text>
      </View>

      {/* 3D Wallet & Card Illustration */}
      <View style={styles.illustrationArea}>
        <View style={styles.pedestalShadow} />
        <View style={styles.walletBody}>
          {/* Credit Card sticking out */}
          <View style={styles.cardStickingOut}>
            <View style={styles.goldChip} />
            <Text style={styles.cardNumber}>•• 4820</Text>
          </View>

          {/* Wallet flap and golden clasp */}
          <View style={styles.walletFlap}>
            <View style={styles.goldClasp} />
          </View>
        </View>
      </View>

      {/* Bottom CTA Button */}
      <View style={styles.bottomArea}>
        <Pressable
          onPress={() => router.replace("/(tabs)")}
          style={({ pressed }) => [
            styles.ctaButton,
            { opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={styles.ctaText}>Commencer →</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0A2016",
    justifyContent: "space-between",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepText: {
    color: "#E2E8F0",
    fontSize: 13,
    fontWeight: "600",
  },
  progressTrack: {
    width: 60,
    height: 3,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    width: 20,
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  skipText: {
    color: "#CBD5E1",
    fontSize: 14,
    fontWeight: "600",
  },
  heroTextContainer: {
    paddingHorizontal: 24,
    marginTop: 20,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -0.8,
    lineHeight: 46,
  },
  heroSubtitle: {
    color: "#94A3B8",
    fontSize: 15,
    fontWeight: "400",
    marginTop: 14,
    lineHeight: 22,
    maxWidth: 280,
  },
  illustrationArea: {
    alignItems: "center",
    justifyContent: "center",
    height: 300,
    position: "relative",
  },
  pedestalShadow: {
    position: "absolute",
    bottom: 20,
    width: 200,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 18,
  },
  walletBody: {
    width: 170,
    height: 190,
    borderRadius: 28,
    backgroundColor: "#0F382A",
    borderWidth: 2,
    borderColor: "#195943",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  cardStickingOut: {
    position: "absolute",
    top: -40,
    width: 140,
    height: 90,
    borderRadius: 14,
    backgroundColor: "#3A5A4A",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    padding: 10,
    justifyContent: "space-between",
  },
  goldChip: {
    width: 24,
    height: 18,
    borderRadius: 4,
    backgroundColor: "#F59E0B",
  },
  cardNumber: {
    color: "#E2E8F0",
    fontSize: 11,
    fontWeight: "700",
    alignSelf: "flex-end",
    fontVariant: ["tabular-nums"],
  },
  walletFlap: {
    width: 150,
    height: 80,
    borderRadius: 20,
    backgroundColor: "#164B38",
    borderWidth: 1,
    borderColor: "#20684F",
    alignItems: "center",
    justifyContent: "center",
  },
  goldClasp: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#F59E0B",
    borderWidth: 2,
    borderColor: "#D97706",
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  ctaButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 18,
    borderRadius: 9999,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  ctaText: {
    color: "#0F382A",
    fontSize: 16,
    fontWeight: "700",
  },
});
