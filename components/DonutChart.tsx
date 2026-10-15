import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { useTheme } from "@/context/ThemeContext";
import { formatCurrency } from "@/utils/dateUtils";

export interface CategorySlice {
  id: string;
  name: string;
  percentage: number;
  color: string;
  amount?: number;
}

interface Props {
  totalSpent: number;
  slices?: CategorySlice[];
}

export function DonutChart({ totalSpent, slices = [] }: Props) {
  const { colors, isDark } = useTheme();

  const data: CategorySlice[] = slices.length > 0 ? slices : [];

  const size = 200;
  const strokeWidth = 26;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativeAngle = 0;

  return (
    <View style={styles.container}>
      {/* Anneau Donut avec Montant au centre */}
      <View style={styles.chartWrapper}>
        <Svg width={size} height={size}>
          <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
            {/* Anneau de fond */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={colors.borderSubtle}
              strokeWidth={strokeWidth}
              fill="transparent"
            />

            {data.map((slice) => {
              if (slice.percentage <= 0) return null;
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

        {/* Texte centré */}
        <View style={styles.centerContent} pointerEvents="none">
          <Text
            style={[styles.centerAmount, { color: colors.text, fontVariant: ["tabular-nums"] }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatCurrency(totalSpent)}
          </Text>
          <Text style={[styles.centerSubtext, { color: colors.textSecondary }]}>
            Total dépensé
          </Text>
        </View>
      </View>

      {/* Légende en 2 colonnes avec vraies catégories de la base de données */}
      {data.length > 0 ? (
        <View style={styles.legendGrid}>
          {data.map((item) => (
            <View key={item.id} style={styles.legendCol}>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={[styles.legendName, { color: colors.text }]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.legendPercent, { color: colors.textSecondary, fontVariant: ["tabular-nums"] }]}>
                {Math.round(item.percentage)}%
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={[styles.emptyLegendText, { color: colors.textSecondary }]}>
          Aucune dépense enregistrée sur cette période.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 12,
  },
  chartWrapper: {
    position: "relative",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  centerContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  centerAmount: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.4,
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
    marginTop: 20,
    paddingHorizontal: 16,
    rowGap: 12,
  },
  legendCol: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingRight: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendName: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  legendPercent: {
    fontSize: 13,
    fontWeight: "700",
  },
  emptyLegendText: {
    marginTop: 16,
    fontSize: 13,
    fontStyle: "italic",
    textAlign: "center",
  },
});
