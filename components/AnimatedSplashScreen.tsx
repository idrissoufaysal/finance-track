import React, { useEffect, useState, useCallback } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import Svg, { Defs, RadialGradient as SvgRadialGradient, Stop, Rect } from "react-native-svg";
import { StitchWalletHero } from "@/components/StitchWalletHero";

const { width, height } = Dimensions.get("window");

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

export function AnimatedSplashScreen({ onAnimationComplete }: AnimatedSplashScreenProps) {
  const [visible, setVisible] = useState(true);

  // Animations d'entrée et de sortie fluide
  const artworkScale = useSharedValue(0.85);
  const artworkOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(18);
  const textOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  const handleComplete = useCallback(() => {
    setVisible(false);
    onAnimationComplete();
  }, [onAnimationComplete]);

  useEffect(() => {
    // 1. Entrée du visuel Stitch avec ressort naturel
    artworkOpacity.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) });
    artworkScale.value = withSpring(1, { damping: 14, stiffness: 120 });

    // 2. Entrée en cascade de la typographie
    textOpacity.value = withDelay(
      280,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.quad) })
    );
    textTranslateY.value = withDelay(
      280,
      withSpring(0, { damping: 16, stiffness: 140 })
    );

    // 3. Sortie en fondu élégant (après ~1.8s)
    const exitTimer = setTimeout(() => {
      artworkScale.value = withTiming(1.08, { duration: 450, easing: Easing.in(Easing.quad) });
      screenOpacity.value = withTiming(
        0,
        { duration: 450, easing: Easing.in(Easing.quad) },
        (finished) => {
          if (finished) {
            runOnJS(handleComplete)();
          }
        }
      );
    }, 1800);

    return () => clearTimeout(exitTimer);
  }, [
    artworkOpacity,
    artworkScale,
    handleComplete,
    screenOpacity,
    textOpacity,
    textTranslateY,
  ]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const artworkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: artworkOpacity.value,
    transform: [{ scale: artworkScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  if (!visible) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, containerAnimatedStyle]}
    >
      {/* Fond vert forêt profond avec lueur d'ambiance Stitch */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={height}>
          <Defs>
            <SvgRadialGradient id="splashGlow" cx="50%" cy="45%" rx="60%" ry="50%">
              <Stop offset="0%" stopColor="#1B4739" stopOpacity="0.45" />
              <Stop offset="60%" stopColor="#0E2B22" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#071914" stopOpacity="0" />
            </SvgRadialGradient>
          </Defs>
          <Rect x="0" y="0" width={width} height={height} fill="#091F18" />
          <Rect x="0" y="0" width={width} height={height} fill="url(#splashGlow)" />
        </Svg>
      </View>

      <View style={styles.centerContent}>
        {/* Composition 3D du portefeuille et piédestal Stitch */}
        <Animated.View style={artworkAnimatedStyle}>
          <StitchWalletHero scale={0.88} />
        </Animated.View>

        {/* Typographie de marque exacte Stitch */}
        <Animated.View style={[styles.textGroup, textAnimatedStyle]}>
          <Text style={styles.brandTitleMain}>Your Money</Text>
          <Text style={styles.brandTitleSub}>Better Days</Text>
          <Text style={styles.brandTagline}>Finance Track</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "#091F18",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999999,
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: {
    alignItems: "center",
    marginTop: 8,
  },
  brandTitleMain: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.6,
  },
  brandTitleSub: {
    fontSize: 32,
    fontWeight: "800",
    color: "#D2E7D7",
    letterSpacing: -0.6,
    marginTop: 1,
  },
  brandTagline: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.65)",
    letterSpacing: 0.8,
    marginTop: 8,
    textTransform: "uppercase",
  },
});
