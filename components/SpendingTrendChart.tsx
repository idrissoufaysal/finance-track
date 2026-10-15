import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency } from "@/utils/dateUtils";
import { DailyPoint } from "@/types/finance";

interface Props {
  points?: DailyPoint[];
}

export function SpendingTrendChart({ points = [] }: Props) {
  const { colors, isDark } = useTheme();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const maxExpense = Math.max(
    ...points.map((p) => p.expense),
    10000
  );

  const activeIndex =
    selectedIndex !== null && selectedIndex < points.length
      ? selectedIndex
      : points.length - 1;

  if (points.length === 0) {
    return (
      <View
        style={[
          styles.card,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Aucune donnée de tendance pour cette période.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.chartArea}>
        {/* Lignes de repère */}
        <View style={styles.gridLines}>
          {[maxExpense, Math.round(maxExpense / 2), 0].map((lvl, i) => (
            <View key={i} style={styles.gridRow}>
              <View
                style={[
                  styles.dashLine,
                  { backgroundColor: colors.borderSubtle },
                ]}
              />
              <Text style={[styles.axisText, { color: colors.textMuted }]}>
                {lvl >= 1000 ? `${Math.round(lvl / 1000)}k` : lvl}
              </Text>
            </View>
          ))}
        </View>

        {/* Barres quotidiennes */}
        <View style={styles.barsContainer}>
          {points.map((item, idx) => {
            const isSelected = activeIndex === idx;
            const ratio = maxExpense > 0 ? Math.min(1, item.expense / maxExpense) : 0;
            const barHeight = Math.max(10, ratio * 130);

            const barBg = isSelected
              ? isDark
                ? "#34D399"
                : "#059669"
              : isDark
              ? "#1A2E23"
              : "#D1E7D6";

            return (
              <Pressable
                key={item.dateString || idx}
                onPress={() => setSelectedIndex(idx)}
                style={styles.barCol}
              >
                {/* Infobulle de la barre active */}
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
                      {formatCurrency(item.expense)}
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

                {/* Libellé du jour (Lun, Mar...) */}
                <Text
                  style={[
                    styles.dayLabel,
                    {
                      color: isSelected ? colors.text : colors.textSecondary,
                      fontWeight: isSelected ? "700" : "500",
                    },
                  ]}
                >
                  {item.dayLabel}
                </Text>
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
    borderRadius: 20,
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
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 24,
    justifyContent: "space-between",
  },
  gridRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dashLine: {
    flex: 1,
    height: 1,
    opacity: 0.8,
  },
  axisText: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 8,
    width: 32,
    textAlign: "right",
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingRight: 40,
    height: 160,
  },
  barCol: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
  },
  tooltipPill: {
    position: "absolute",
    top: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    zIndex: 10,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  barTrack: {
    width: 14,
    height: 130,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  barThumb: {
    width: 12,
    borderRadius: 6,
  },
  dayLabel: {
    fontSize: 11,
    marginTop: 6,
  },
  emptyText: {
    textAlign: "center",
    paddingVertical: 30,
    fontSize: 13,
    fontStyle: "italic",
  },
});
