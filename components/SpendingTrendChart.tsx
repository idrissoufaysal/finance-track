import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { formatCompact, formatCurrency } from "@/utils/dateUtils";

interface BarPoint {
  label: string;
  amount: number;
}

interface Props {
  points?: BarPoint[];
}

export function SpendingTrendChart({ points }: Props) {
  const { colors, isDark } = useTheme();

  // Demo trend points matching Screenshot 3 & 5
  const data: BarPoint[] = points && points.length > 0 ? points : [
    { label: "1", amount: 480 },
    { label: "2", amount: 620 },
    { label: "3", amount: 510 },
    { label: "4", amount: 590 },
    { label: "5", amount: 890 },
    { label: "6", amount: 1250 },
  ];

  const [selectedIndex, setSelectedIndex] = useState<number>(data.length - 1);

  const maxVal = 1500;
  const gridLevels = [1500, 1000, 500];

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.chartArea}>
        {/* Y-Axis lines and numbers */}
        <View style={styles.gridLines}>
          {gridLevels.map((lvl) => (
            <View key={lvl} style={styles.gridRow}>
              <View style={[styles.dashLine, { backgroundColor: colors.borderSubtle }]} />
              <Text style={[styles.axisText, { color: colors.textMuted }]}>
                {lvl >= 1000 ? `${lvl / 1000}K` : lvl}
              </Text>
            </View>
          ))}
        </View>

        {/* Bars Container */}
        <View style={styles.barsContainer}>
          {data.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            const ratio = Math.min(1, item.amount / maxVal);
            const barHeight = Math.max(16, ratio * 140);

            const barBg = isSelected
              ? (isDark ? "#34D399" : "#0D2E22")
              : (isDark ? "#1A2E23" : "#B7C9BD");

            return (
              <Pressable
                key={idx}
                onPress={() => setSelectedIndex(idx)}
                style={styles.barCol}
              >
                {/* Floating Tooltip for Selected Bar */}
                {isSelected && (
                  <View
                    style={[
                      styles.tooltipPill,
                      {
                        backgroundColor: isDark ? "#09100C" : "#0D2E22",
                        borderColor: isDark ? "#34D399" : "#1D4B39",
                      },
                    ]}
                  >
                    <Text style={styles.tooltipText}>
                      {formatCurrency(item.amount * 1000)}
                    </Text>
                  </View>
                )}

                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.barThumb,
                      {
                        height: barHeight,
                        backgroundColor: barBg,
                      },
                    ]}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  chartArea: {
    height: 190,
    position: "relative",
    justifyContent: "flex-end",
  },
  gridLines: {
    ...StyleSheet.absoluteFill,
    justifyContent: "space-between",
    paddingBottom: 10,
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dashLine: {
    flex: 1,
    height: 1,
    marginRight: 8,
  },
  axisText: {
    fontSize: 10,
    fontWeight: "500",
    width: 28,
    textAlign: "right",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingRight: 36,
    paddingLeft: 8,
    height: 160,
  },
  barCol: {
    alignItems: "center",
    height: "100%",
    justifyContent: "flex-end",
    flex: 1,
    position: "relative",
  },
  tooltipPill: {
    position: "absolute",
    top: 0,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  tooltipText: {
    color: "#34D399",
    fontSize: 11,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  barTrack: {
    width: 28,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barThumb: {
    width: 24,
    borderRadius: 8,
  },
});
