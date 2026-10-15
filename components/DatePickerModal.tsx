import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { toISODate } from "@/utils/dateUtils";

interface Props {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onSelect: (date: Date) => void;
}

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export function DatePickerModal({ visible, value, onClose, onSelect }: Props) {
  const { colors, isDark } = useTheme();
  const [viewMonth, setViewMonth] = useState(() => new Date(value.getFullYear(), value.getMonth(), 1));

  const resetToValueMonth = () => {
    setViewMonth(new Date(value.getFullYear(), value.getMonth(), 1));
  };

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;

  const cells: (number | null)[] = [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const monthLabel = viewMonth
    .toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    .replace(/^\w/, (c) => c.toUpperCase());

  const selectedISO = toISODate(value);
  const todayISO = toISODate(new Date());

  const shiftMonth = (delta: number) => {
    setViewMonth(new Date(year, month + delta, 1));
  };

  const handleSelect = (day: number) => {
    onSelect(new Date(year, month, day));
    onClose();
  };

  const goToday = () => {
    onSelect(new Date());
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} onShow={resetToValueMonth}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { backgroundColor: colors.surface, borderColor: colors.border }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Navigateur de mois */}
          <View style={styles.monthNav}>
            <Pressable
              onPress={() => shiftMonth(-1)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Mois précédent"
              style={[styles.navBtn, { backgroundColor: colors.surfaceSecondary }]}
            >
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </Pressable>
            <Text style={[styles.monthLabel, { color: colors.text }]}>{monthLabel}</Text>
            <Pressable
              onPress={() => shiftMonth(1)}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Mois suivant"
              style={[styles.navBtn, { backgroundColor: colors.surfaceSecondary }]}
            >
              <Ionicons name="chevron-forward" size={18} color={colors.text} />
            </Pressable>
          </View>

          {/* Jours de la semaine */}
          <View style={styles.weekRow}>
            {WEEKDAYS.map((d, i) => (
              <Text key={i} style={[styles.weekday, { color: colors.textMuted }]}>
                {d}
              </Text>
            ))}
          </View>

          {/* Grille des jours */}
          <View style={styles.grid}>
            {cells.map((day, idx) => {
              if (day === null) return <View key={idx} style={styles.cell} />;
              const iso = toISODate(new Date(year, month, day));
              const isSelected = iso === selectedISO;
              const isToday = iso === todayISO;
              return (
                <Pressable
                  key={idx}
                  onPress={() => handleSelect(day)}
                  accessibilityRole="button"
                  style={[
                    styles.cell,
                    isSelected && { backgroundColor: colors.tint, borderRadius: 12 },
                    !isSelected && isToday && { borderWidth: 1, borderColor: colors.tint, borderRadius: 12 },
                  ]}
                >
                  <Text
                    style={{
                      color: isSelected ? colors.onTint : colors.text,
                      fontWeight: isSelected || isToday ? "700" : "500",
                      fontSize: 14,
                    }}
                  >
                    {day}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Actions */}
          <View style={styles.footer}>
            <Pressable onPress={onClose} style={styles.footerBtn} accessibilityRole="button">
              <Text style={{ color: colors.textSecondary, fontWeight: "600", fontSize: 14 }}>
                Annuler
              </Text>
            </Pressable>
            <Pressable
              onPress={goToday}
              style={[styles.todayBtn, { backgroundColor: isDark ? colors.tintSoft : colors.surfaceSecondary }]}
              accessibilityRole="button"
            >
              <Ionicons name="today-outline" size={16} color={colors.tint} />
              <Text style={{ color: colors.tint, fontWeight: "700", fontSize: 14 }}>{"Aujourd'hui"}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  sheet: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  monthLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  weekRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  weekday: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "700",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cell: {
    width: `${100 / 7}%`,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  footerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  todayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
});
