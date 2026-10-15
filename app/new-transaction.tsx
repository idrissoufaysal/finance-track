import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { DatePickerModal } from "@/components/DatePickerModal";
import { toISODate, formatAmount } from "@/utils/dateUtils";
import { TransactionType } from "@/types/finance";

export default function NewTransactionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>("expense");
  const [amountValue, setAmountValue] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const amountInputRef = useRef<TextInput>(null);

  const borderPrimary = colors.tint + "44";

  const handleAddQuickAmount = (val: number) => {
    setAmountValue((prev) => prev + val);
  };

  const handleRoundAmount = () => {
    if (amountValue <= 0) {
      setAmountValue(1000);
      return;
    }
    const roundStep = amountValue >= 10000 ? 5000 : 1000;
    const ceil = Math.ceil(amountValue / roundStep) * roundStep;
    setAmountValue(ceil === amountValue ? amountValue + roundStep : ceil);
  };

  const handleBackspace = () => {
    if (amountValue <= 0) {
      setAmountValue(0);
      return;
    }
    const str = amountValue.toString();
    if (str.length <= 1) {
      setAmountValue(0);
      return;
    }
    const sliced = str.slice(0, -1);
    setAmountValue(parseInt(sliced, 10) || 0);
  };

  const handleAmountInputChange = (text: string) => {
    const digits = text.replace(/\D/g, "");
    setAmountValue(digits ? parseInt(digits, 10) : 0);
  };

  const handleHelp = () => {
    Alert.alert(
      "Nouvelle transaction",
      "Saisissez le montant en FCFA, le libellé, puis enregistrez.",
      [{ text: "Compris" }]
    );
  };

  const handleSave = async () => {
    if (amountValue <= 0) {
      Alert.alert("Montant manquant", "Veuillez saisir un montant supérieur à 0 FCFA.");
      amountInputRef.current?.focus();
      return;
    }

    if (!title.trim()) {
      Alert.alert("Libellé manquant", "Veuillez saisir un libellé ou commerçant pour cette opération.");
      return;
    }

    const now = selectedDate;
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    try {
      await addTransaction({
        title: title.trim(),
        amount: amountValue,
        type,
        date: toISODate(now),
        time,
        note: isRecurring ? "Transaction récurrente" : undefined,
      });
      router.back();
    } catch {
      Alert.alert("Erreur", "Impossible d'enregistrer la transaction.");
    }
  };

  const getFormattedDateLabel = (d: Date): string => {
    const today = new Date();
    const isToday =
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear();

    const monthStr = d.toLocaleDateString("fr-FR", { month: "short" });
    const capitalizedMonth = monthStr.charAt(0).toUpperCase() + monthStr.slice(1).replace(".", "");

    if (isToday) {
      return `Aujourd'hui, ${d.getDate()} ${capitalizedMonth}`;
    }
    return `${d.toLocaleDateString("fr-FR", { weekday: "short" })}, ${d.getDate()} ${capitalizedMonth}`;
  };

  const currentTimeStr = `${String(selectedDate.getHours()).padStart(2, "0")}:${String(
    selectedDate.getMinutes()
  ).padStart(2, "0")}`;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        {/* Poignée de glissement */}
        <View style={styles.grabberWrapper}>
          <View style={[styles.grabber, { backgroundColor: colors.border }]} />
        </View>

        {/* En-tête modal */}
        <View style={[styles.headerRow, { borderBottomColor: colors.borderSubtle }]}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.headerCancelBtn, { opacity: pressed ? 0.7 : 1 }]}
            hitSlop={12}
            accessibilityRole="button"
          >
            <Text style={[styles.headerCancelText, { color: colors.textSecondary }]}>Annuler</Text>
          </Pressable>

          <Text style={[styles.headerTitle, { color: colors.text }]}>Nouvelle transaction</Text>

          <Pressable
            onPress={handleHelp}
            style={({ pressed }) => [styles.headerActionBtn, { opacity: pressed ? 0.7 : 1 }]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Aide"
          >
            <Ionicons name="help-circle-outline" size={22} color={colors.textSecondary} />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* 1. Sélecteur Dépense / Revenu */}
          <View
            style={[
              styles.segmentedContainer,
              { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderSubtle },
            ]}
          >
            {(["expense", "income"] as const).map((t) => {
              const active = type === t;
              return (
                <Pressable
                  key={t}
                  onPress={() => setType(t)}
                  accessibilityRole="button"
                  style={[
                    styles.segmentedBtn,
                    active && [
                      styles.segmentedBtnActive,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                    ],
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentedBtnText,
                      {
                        color: active ? colors.text : colors.textSecondary,
                        fontWeight: active ? "700" : "500",
                      },
                    ]}
                  >
                    {t === "expense" ? "Dépense" : "Revenu"}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* 2. Carte Hero Montant en FCFA */}
          <View
            style={[
              styles.amountCard,
              {
                backgroundColor: colors.surface,
                borderColor: borderPrimary,
                shadowColor: colors.tint,
              },
            ]}
          >
            <View style={[styles.glowBlob, { backgroundColor: colors.tintSoft }]} pointerEvents="none" />

            <View style={styles.amountHeaderRow}>
              <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>MONTANT TOTAL</Text>

              <View style={[styles.currencyBadge, { backgroundColor: colors.surfaceSecondary, borderColor: borderPrimary }]}>
                <View style={[styles.pulsingDot, { backgroundColor: colors.tint }]} />
                <Text style={[styles.currencyBadgeText, { color: colors.tint }]}>FCFA</Text>
              </View>
            </View>

            <View style={styles.numericRow}>
              <Pressable onPress={() => amountInputRef.current?.focus()} style={styles.amountTouchArea}>
                <Text
                  style={[
                    styles.amountMainDigits,
                    { color: amountValue === 0 ? colors.textMuted : colors.text },
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {formatAmount(amountValue)}
                </Text>
                <Text style={[styles.amountCurrencySymbol, { color: colors.tint }]}>FCFA</Text>
              </Pressable>

              <TextInput
                ref={amountInputRef}
                value={amountValue === 0 ? "" : amountValue.toString()}
                onChangeText={handleAmountInputChange}
                keyboardType="number-pad"
                style={styles.hiddenInput}
                placeholder="0"
                caretHidden
                autoFocus
              />

              <Pressable
                onPress={handleBackspace}
                accessibilityRole="button"
                accessibilityLabel="Effacer le dernier chiffre"
                style={({ pressed }) => [
                  styles.backspaceBtn,
                  { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderSubtle, opacity: pressed ? 0.7 : 1 },
                ]}
                hitSlop={8}
              >
                <Ionicons name="backspace-outline" size={20} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Touches rapides d'incrément */}
            <View style={[styles.quickPillsRow, { borderTopColor: colors.borderSubtle }]}>
              {[1000, 5000, 10000].map((val) => (
                <Pressable
                  key={val}
                  onPress={() => handleAddQuickAmount(val)}
                  style={({ pressed }) => [
                    styles.quickPill,
                    { backgroundColor: colors.surfaceSecondary, borderColor: colors.borderSubtle, opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={[styles.quickPillText, { color: colors.text }]}>+{formatAmount(val)}</Text>
                </Pressable>
              ))}

              <Pressable
                onPress={handleRoundAmount}
                style={({ pressed }) => [
                  styles.quickPill,
                  { backgroundColor: colors.tintSoft, borderColor: borderPrimary, opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={[styles.quickPillArrondirText, { color: colors.tint }]}>Arrondir</Text>
              </Pressable>
            </View>
          </View>

          {/* 3. Libellé / Titre & Date */}
          <View style={styles.fieldSection}>
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>LIBELLÉ / TITRE</Text>
            <View style={[styles.inputContainer, { backgroundColor: colors.surface, borderColor: colors.borderSubtle }]}>
              <Ionicons
                name="storefront-outline"
                size={20}
                color={colors.textSecondary}
                style={styles.inputLeftIcon}
              />
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Déjeuner, Taxi, Supermarché, Salaire..."
                placeholderTextColor={colors.textMuted}
                style={[styles.textInputField, { color: colors.text }]}
              />
            </View>

            {/* Sélecteur de date & récurrence */}
            <View style={styles.dateTimeRow}>
              <Pressable
                onPress={() => setDateModalVisible(true)}
                accessibilityRole="button"
                style={({ pressed }) => [
                  styles.datePillBtn,
                  { backgroundColor: colors.surface, borderColor: colors.borderSubtle, opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <View style={styles.datePillLeft}>
                  <Ionicons name="calendar-outline" size={18} color={colors.tint} />
                  <Text style={[styles.datePillText, { color: colors.text }]}>
                    {getFormattedDateLabel(selectedDate)}
                  </Text>
                </View>
                <View style={[styles.timeBadge, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={[styles.timeBadgeText, { color: colors.textSecondary }]}>{currentTimeStr}</Text>
                </View>
              </Pressable>

              <Pressable
                onPress={() => setIsRecurring((v) => !v)}
                accessibilityRole="button"
                accessibilityState={{ selected: isRecurring }}
                accessibilityLabel="Marquer comme récurrente"
                style={({ pressed }) => [
                  styles.repeatBtn,
                  {
                    backgroundColor: isRecurring ? colors.tintSoft : colors.surface,
                    borderColor: isRecurring ? borderPrimary : colors.borderSubtle,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="repeat"
                  size={20}
                  color={isRecurring ? colors.tint : colors.textSecondary}
                />
              </Pressable>
            </View>

            {isRecurring && (
              <Text style={[styles.recurringHint, { color: colors.tint }]}>
                Marqué comme récurrent mensuel
              </Text>
            )}
          </View>
        </ScrollView>

        {/* Bouton d'enregistrement fixé en bas */}
        <View style={[styles.bottomCtaBar, { backgroundColor: colors.background, borderTopColor: colors.borderSubtle }]}>
          <Pressable
            onPress={handleSave}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: colors.tint, shadowColor: colors.tint, opacity: pressed ? 0.9 : 1 },
            ]}
          >
            <Ionicons name="checkmark-circle" size={22} color={colors.onTint} />
            <Text style={[styles.submitBtnText, { color: colors.onTint }]}>
              Enregistrer {type === "expense" ? "la dépense" : "le revenu"}
            </Text>
          </Pressable>
        </View>

        <DatePickerModal
          visible={dateModalVisible}
          value={selectedDate}
          onClose={() => setDateModalVisible(false)}
          onSelect={setSelectedDate}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  grabberWrapper: {
    alignItems: "center",
    paddingTop: 8,
    paddingBottom: 4,
  },
  grabber: {
    width: 44,
    height: 5,
    borderRadius: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerCancelBtn: {
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  headerCancelText: {
    fontSize: 15,
    fontWeight: "500",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
  },
  headerActionBtn: {
    padding: 6,
    borderRadius: 999,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 24,
    gap: 16,
  },
  segmentedContainer: {
    flexDirection: "row",
    borderRadius: 999,
    padding: 4,
    borderWidth: 1,
  },
  segmentedBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentedBtnActive: {
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentedBtnText: {
    fontSize: 14,
  },
  amountCard: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    position: "relative",
    overflow: "hidden",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 3,
  },
  glowBlob: {
    position: "absolute",
    right: -30,
    bottom: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  amountHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  currencyBadge: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3.5,
    borderRadius: 999,
    gap: 6,
  },
  pulsingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  currencyBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  numericRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  amountTouchArea: {
    flexDirection: "row",
    alignItems: "baseline",
    flex: 1,
    flexWrap: "wrap",
  },
  amountMainDigits: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -0.5,
    fontVariant: ["tabular-nums"],
  },
  amountCurrencySymbol: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 6,
  },
  hiddenInput: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  backspaceBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quickPillsRow: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 12,
    marginTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  quickPill: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  quickPillText: {
    fontSize: 11,
    fontWeight: "600",
  },
  quickPillArrondirText: {
    fontSize: 11,
    fontWeight: "700",
  },
  fieldSection: {
    gap: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 48,
  },
  inputLeftIcon: {
    marginRight: 10,
  },
  textInputField: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    paddingVertical: 0,
  },
  dateTimeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
  },
  datePillBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    height: 48,
  },
  datePillLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  datePillText: {
    fontSize: 13,
    fontWeight: "500",
  },
  timeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 999,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },
  repeatBtn: {
    width: 48,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  recurringHint: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
  },
  bottomCtaBar: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 16 : 14,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    height: 52,
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  submitBtnText: {
    fontSize: 16,
    fontWeight: "800",
  },
});
