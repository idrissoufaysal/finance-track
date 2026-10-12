import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { Palette } from '@/constants/Colors';
import { TimeFrame } from '@/types/finance';

export function PeriodSelector() {
  const theme = useColorScheme();
  const colors = Colors[theme];
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
    { key: 'day', label: 'Jour' },
    { key: 'week', label: 'Semaine' },
    { key: 'month', label: 'Mois' },
  ];

  return (
    <View style={styles.container}>
      {/* Segmented Control */}
      <View style={[styles.segmentedWrapper, { backgroundColor: colors.surfaceSecondary }]}>
        {options.map((opt) => {
          const isActive = timeFrame === opt.key;
          return (
            <Pressable
              key={opt.key}
              onPress={() => setTimeFrame(opt.key)}
              style={[
                styles.segmentItem,
                isActive && [
                  styles.segmentItemActive,
                  { backgroundColor: colors.surface, shadowColor: '#000' },
                ],
              ]}
            >
              <Text
                style={[
                  styles.segmentLabel,
                  { color: isActive ? colors.text : colors.textSecondary },
                  isActive && styles.segmentLabelActive,
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Date Navigation Bar */}
      <View style={styles.navRow}>
        <Pressable
          onPress={goToPrevious}
          style={({ pressed }) => [
            styles.arrowButton,
            { backgroundColor: colors.surfaceSecondary, opacity: pressed ? 0.7 : 1 },
          ]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>

        <Pressable
          onPress={goToToday}
          style={styles.titleWrapper}
        >
          <Text style={[styles.periodTitleText, { color: colors.text }]} numberOfLines={1}>
            {periodTitle}
          </Text>
          {!isCurrent && (
            <View style={[styles.todayBadge, { backgroundColor: colors.tint + '20' }]}>
              <Text style={[styles.todayBadgeText, { color: colors.tint }]}>Revenir</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          onPress={goToNext}
          style={({ pressed }) => [
            styles.arrowButton,
            { backgroundColor: colors.surfaceSecondary, opacity: pressed ? 0.7 : 1 },
          ]}
          hitSlop={8}
        >
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  segmentedWrapper: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentItemActive: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  segmentLabelActive: {
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  arrowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: 8,
    gap: 8,
  },
  periodTitleText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  todayBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
