import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency } from "@/utils/dateUtils";

interface CategorySlice {
  id: string;
  name: string;
  percentage: number;
  color: string;
}

interface Props {
  totalSpent: number;
  slices?: CategorySlice[];
}

export function DonutChart({ totalSpent, slices }: Props) {
  const { colors, isDark } = useTheme();

  // Default demo slices if no custom transactions exist, matching Stitch Screenshots 3 & 5 exactly
  const data: CategorySlice[] = slices && slices.length > 0 ? slices : [
    { id: "shopping", name: "Shopping", percentage: 32, color: isDark ? "#34D399" : "#0D2E22" },
    { id: "entertainment", name: "Entertainment", percentage: 12, color: isDark ? "#A7F3D0" : "#84A98C" },
    { id: "food", name: "Food & Drinks", percentage: 18, color: isDark ? "#10B981" : "#1B4332" },
    { id: "bills", name: "Bills & Utilities", percentage: 10, color: isDark ? "#6EE7B7" : "#ADC178" },
    { id: "transport", name: "Transport", percentage: 14, color: isDark ? "#059669" : "#52796F" },
    { id: "others", name: "Others", percentage: 14, color: isDark ? "#D1FAE5" : "#D8F3DC" },
  ];

  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <View style={styles.container}>
      {/* Donut Ring with Center Text */}
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {data.map((slice) => {
              const strokeDasharray = `${(slice.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativeAngle;
              cumulativeAngle += (slice.percentage / 100) * circumference;

              return (
                <Circle
                  key={slice.id}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                />
              );
            })}
          </G>
        </Svg>

        {/* Center label */}
        <View style={styles.centerContent} pointerEvents="none">
          <Text
            style={[styles.centerAmount, { color: colors.text, fontVariant: ["tabular-nums"] }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatCurrency(totalSpent)}
          </Text>
          <Text style={[styles.centerSubtext, { color: colors.textSecondary }]}>
            Total Spent
          </Text>
        </View>
      </View>

      {/* 2-Columns Category Breakdown List */}
      <View style={styles.legendGrid}>
        {data.map((item) => (
          <View key={item.id} style={styles.legendCol}>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={[styles.legendName, { color: colors.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={[styles.legendPercent, { color: colors.text, fontVariant: ["tabular-nums"] }]}>
              {Math.round(item.percentage)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 12,
  },
  chartWrapper: {
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  centerAmount: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
    textAlign: "center",
  },
  centerSubtext: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
    rowGap: 14,
  },
  legendCol: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  legendPercent: {
    fontSize: 13,
    fontWeight: "700",
  },
});
