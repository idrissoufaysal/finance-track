import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '@/context/FinanceContext';
import { useTheme } from '@/context/ThemeContext';
import { TimeFrame } from '@/types/finance';
import { MaskedTabBar } from '@/components/ui/masked-tab-bar';

export function PeriodSelector() {
  const { colors, isDark } = useTheme();
  const {
    timeFrame,
    setTimeFrame,
    goToPrevious,
    goToNext,
    goToToday,
    periodTitle,
    isCurrent,
  } = useFinance();

  const options: { key: TimeFrame; label: string }[] = [
    { key: 'day', label: "Aujourd'hui" },
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
    { key: 'year', label: 'Année' },
  ];

  return (
    <View style={styles.container}>
      {/* 4 Filtres : Aujourd'hui | Semaine | Mois | Année avec MaskedTabBar Reacticx */}
      <View
        style={[
          styles.segmentedWrapper,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: colors.border,
          },
        ]}
      >
        <MaskedTabBar
          value={timeFrame}
          onValueChange={(val) => setTimeFrame(val as TimeFrame)}
          theme={isDark ? 'dark' : 'light'}
          palette={{
            track: 'transparent',
            pill: isDark ? colors.surface : '#FFFFFF',
            inactive: colors.textSecondary,
            active: colors.tint,
          }}
          height={38}
          radius={11}
          padding={2}
          gap={2}
          fontSize={12}
          fontWeight="700"
          draggable={false}
        >
          <MaskedTabBar.List>
            {options.map((opt) => (
              <MaskedTabBar.Trigger key={opt.key} value={opt.key}>
                <MaskedTabBar.Label>{opt.label}</MaskedTabBar.Label>
              </MaskedTabBar.Trigger>
            ))}
          </MaskedTabBar.List>
        </MaskedTabBar>
      </View>

      {/* Barre de navigation temporelle (< Libellé >) */}
      <View style={styles.navBar}>
        <Pressable
          onPress={goToPrevious}
          style={({ pressed }) => [
            styles.navArrow,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              opacity: pressed ? 0.6 : 1,
            },
          ]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={16} color={colors.text} />
        </Pressable>

        <Pressable onPress={goToToday} style={styles.titleWrap}>
          <Text style={[styles.periodTitleText, { color: colors.text }]}>
            {periodTitle}
          </Text>
          {!isCurrent && (
            <View style={[styles.todayBadge, { backgroundColor: colors.tint + "20" }]}>
              <Text style={[styles.todayBadgeText, { color: colors.tint }]}>
                {"Aujourd'hui"}
              </Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={goToNext}
          disabled={isCurrent}
          accessibilityRole="button"
          accessibilityLabel="Période suivante"
          accessibilityState={{ disabled: isCurrent }}
          style={({ pressed }) => [
            styles.navArrow,
            {
              backgroundColor: colors.surfaceSecondary,
              borderColor: colors.border,
              opacity: isCurrent ? 0.35 : pressed ? 0.6 : 1,
            },
          ]}
          hitSlop={8}
        >
          <Ionicons
            name="chevron-forward"
            size={16}
            color={isCurrent ? colors.textSecondary : colors.text}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 4,
    gap: 8,
  },
  segmentedWrapper: {
    borderRadius: 14,
    padding: 3,
    borderWidth: 1,
    overflow: 'hidden',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  navArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  titleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  periodTitleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  todayBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  todayBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
