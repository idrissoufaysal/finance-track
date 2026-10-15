import React from "react";
import { View, Text, StyleSheet, Pressable, Platform, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Rect } from "react-native-svg";
import { ONBOARDING_STORAGE_KEY } from "@/services/storageShared";
import { StitchWalletHero } from "@/components/StitchWalletHero";

const { width, height } = Dimensions.get("window");

export default function OnboardingScreen() {
  const router = useRouter();

  const finish = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch {
      // Non-blocking: continue even if storage fails
    }
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.rootContainer}>
      <StatusBar style="light" />

      {/* 1. Fond organique dégradé vert forêt profond */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={height}>
          <Defs>
            {/* Lueur d'ambiance en haut à gauche */}
            <SvgRadialGradient id="ambientGlowTop" cx="20%" cy="25%" rx="60%" ry="50%">
              <Stop offset="0%" stopColor="#1C4B3D" stopOpacity="0.45" />
              <Stop offset="60%" stopColor="#0E2B22" stopOpacity="0.1" />
              <Stop offset="100%" stopColor="#071914" stopOpacity="0" />
            </SvgRadialGradient>

            {/* Lueur d'ambiance douce en bas */}
            <SvgRadialGradient id="ambientGlowBottom" cx="60%" cy="80%" rx="70%" ry="60%">
              <Stop offset="0%" stopColor="#2A5E4C" stopOpacity="0.35" />
              <Stop offset="50%" stopColor="#0E2B22" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#071914" stopOpacity="0" />
            </SvgRadialGradient>
          </Defs>

          {/* Fond de base vert forêt sombre */}
          <Rect x="0" y="0" width={width} height={height} fill="#091F18" />
          {/* Couches de lueur diffuse */}
          <Rect x="0" y="0" width={width} height={height} fill="url(#ambientGlowTop)" />
          <Rect x="0" y="0" width={width} height={height} fill="url(#ambientGlowBottom)" />
        </Svg>
      </View>

      <SafeAreaView style={styles.safeArea}>
        {/* 2. Barre d'étapes supérieure : 01 / 03  [---]  Skip */}
        <View style={styles.topNavigation}>
          <View style={styles.stepperWrap}>
            <Text style={styles.stepperText}>01 / 03</Text>
            {/* Barre de progression avec 1er segment actif */}
            <View style={styles.progressTrack}>
              <View style={styles.progressSegmentActive} />
              <View style={styles.progressSegmentInactive} />
              <View style={styles.progressSegmentInactive} />
            </View>
          </View>

          <Pressable
            onPress={finish}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Passer l'introduction"
            style={({ pressed }) => [{ opacity: pressed ? 0.6 : 0.85 }]}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* 3. Typographie d'accroche Stitch : Your Money • Better Days */}
        <View style={styles.heroCopySection}>
          <Text style={styles.heroTitleMain}>Your Money</Text>
          <Text style={styles.heroTitleSub}>Better Days</Text>
          <Text style={styles.heroSubtitle}>
            Save, spend, and grow your wealth — all in one simple place.
          </Text>
        </View>

        {/* 4. Illustration 3D : Portefeuille en cuir & Carte sur piédestal */}
        <View style={styles.artworkSection}>
          <StitchWalletHero scale={width < 380 ? 0.92 : 1} />
        </View>

        {/* 5. Bouton d'action CTA : Get Started → */}
        <View style={styles.bottomCtaSection}>
          <Pressable
            onPress={finish}
            accessibilityRole="button"
            accessibilityLabel="Commencer"
            style={({ pressed }) => [
              styles.ctaButton,
              {
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.92 : 1,
              },
            ]}
          >
            <Text style={styles.ctaText}>Get Started</Text>
            <Ionicons name="arrow-forward" size={18} color="#0C2D23" />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: "#091F18",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  topNavigation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 28,
    paddingTop: Platform.OS === "android" ? 14 : 8,
    zIndex: 20,
  },
  stepperWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  stepperText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.8,
  },
  progressTrack: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  progressSegmentActive: {
    width: 22,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  progressSegmentInactive: {
    width: 14,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
  },
  skipText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 14,
    fontWeight: "500",
  },
  heroCopySection: {
    paddingHorizontal: 28,
    marginTop: 16,
    zIndex: 20,
  },
  heroTitleMain: {
    color: "#FFFFFF",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -0.6,
    lineHeight: 44,
  },
  heroTitleSub: {
    color: "#D2E7D7",
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: -0.6,
    lineHeight: 44,
    marginTop: 2,
  },
  heroSubtitle: {
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 15,
    fontWeight: "400",
    lineHeight: 22,
    marginTop: 14,
    maxWidth: 270,
  },
  artworkSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  bottomCtaSection: {
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === "ios" ? 12 : 24,
    zIndex: 20,
  },
  ctaButton: {
    width: "100%",
    height: 58,
    backgroundColor: "#FFFFFF",
    borderRadius: 29,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 8,
  },
  ctaText: {
    color: "#0C2D23",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
});
