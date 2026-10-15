import React, { useEffect } from "react";
import { View, StyleSheet, Pressable, Platform } from "react-native";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  interpolateColor,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/context/ThemeContext";

const TAB_ICON_SIZE = 22;
const SPRING = { damping: 18, stiffness: 220, mass: 0.8 };

function TabBarItem({
  focused,
  icon,
  label,
}: {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const { colors, isDark } = useTheme();
  const progress = useSharedValue(focused ? 1 : 0);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    progress.value = withSpring(focused ? 1 : 0, SPRING);
    if (focused) {
      iconScale.value = withSequence(
        withTiming(0.86, { duration: 90 }),
        withSpring(1.14, { damping: 10, stiffness: 280 }),
        withSpring(1, { damping: 16, stiffness: 220 })
      );
    } else {
      iconScale.value = withSpring(1, SPRING);
    }
  }, [focused, progress, iconScale]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.88 + progress.value * 0.12 }],
  }));

  const iconBounceStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const outlineStyle = useAnimatedStyle(() => ({ opacity: 1 - progress.value }));
  const filledStyle = useAnimatedStyle(() => ({ opacity: progress.value }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      progress.value,
      [0, 1],
      [colors.textSecondary, colors.tint]
    ),
  }));

  return (
    <View style={styles.tabItemWrap}>
      <Animated.View
        style={[
          styles.activePill,
          {
            backgroundColor: isDark
              ? "rgba(52, 211, 153, 0.16)"
              : colors.surfaceSecondary,
          },
          pillStyle,
        ]}
      />
      <Animated.View style={[styles.iconStack, iconBounceStyle]}>
        <Animated.View style={[styles.iconLayer, outlineStyle]}>
          <Ionicons
            name={`${icon}-outline` as keyof typeof Ionicons.glyphMap}
            size={TAB_ICON_SIZE}
            color={colors.textSecondary}
          />
        </Animated.View>
        <Animated.View style={[styles.iconLayer, filledStyle]}>
          <Ionicons name={icon} size={TAB_ICON_SIZE} color={colors.tint} />
        </Animated.View>
      </Animated.View>
      <Animated.Text style={[styles.tabLabel, labelStyle]} numberOfLines={1}>
        {label}
      </Animated.Text>
    </View>
  );
}

function FloatingActionButton({ onPress }: { onPress: () => void }) {
  const { colors } = useTheme();
  const pressed = useSharedValue(0);

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 - pressed.value * 0.08 }],
  }));

  return (
    <View style={styles.floatingCenterWrap}>
      <View style={[styles.fabHalo, { backgroundColor: colors.tintSoft }]} />
      <Animated.View style={buttonStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={() => (pressed.value = withTiming(1, { duration: 100 }))}
          onPressOut={() =>
            (pressed.value = withTiming(0, {
              duration: 180,
              easing: Easing.out(Easing.quad),
            }))
          }
          style={[
            styles.floatingCenterBtn,
            {
              backgroundColor: colors.tint,
              borderColor: colors.surface,
              shadowColor: colors.tint,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.45,
              shadowRadius: 10,
              elevation: 8,
            },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Nouvelle transaction"
        >
          <Ionicons name="add" size={32} color={colors.onTint} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  const { colors } = useTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bottomPadding = Math.max(insets.bottom, Platform.OS === "ios" ? 18 : 10);
  const barHeight = 58 + bottomPadding;

  const openNewTransaction = () => router.push("/new-transaction");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            height: barHeight,
            paddingBottom: bottomPadding,
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          },
          Platform.OS === "android" ? styles.tabBarAndroid : styles.tabBarShadow,
        ],
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ focused }) => (
            <TabBarItem focused={focused} icon="home" label="Accueil" />
          ),
        }}
      />

      {/* Bouton central [+] surélevé */}
      <Tabs.Screen
        name="center-action"
        options={{
          title: "",
          tabBarButton: () => <FloatingActionButton onPress={openNewTransaction} />,
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            openNewTransaction();
          },
        }}
      />

      <Tabs.Screen
        name="transactions"
        options={{
          title: "Historique",
          tabBarIcon: ({ focused }) => (
            <TabBarItem focused={focused} icon="receipt" label="Historique" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    paddingHorizontal: 20,
    paddingTop: 8,
    borderCurve: "continuous",
  },
  tabBarShadow: {
    shadowColor: "#0D2E22",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  tabBarAndroid: {
    elevation: 16,
  },
  tabItemWrap: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 22,
    minWidth: 84,
    borderCurve: "continuous",
    position: "relative",
  },
  activePill: {
    ...StyleSheet.absoluteFill,
    borderRadius: 22,
    borderCurve: "continuous",
  },
  iconStack: {
    width: TAB_ICON_SIZE,
    height: TAB_ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  iconLayer: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: -0.1,
  },
  floatingCenterWrap: {
    top: -24,
    justifyContent: "center",
    alignItems: "center",
  },
  fabHalo: {
    position: "absolute",
    width: 74,
    height: 74,
    borderRadius: 37,
    borderCurve: "continuous",
  },
  floatingCenterBtn: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderCurve: "continuous",
  },
});
