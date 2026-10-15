import React, { useState, useRef, useMemo } from "react";
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
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import { toISODate, formatAmount } from "@/utils/dateUtils";
import { TransactionType } from "@/types/finance";

export default function NewTransactionScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const { addTransaction } = useFinance();

  // Thème dual : Forest Obsidian (Sombre) & Forest Wealth (Clair)
  const theme = useMemo(
    () => ({
      bg: isDark ? "#0c1511" : "#f7f9f6",
      containerLowest: isDark ? "#07100c" : "#ffffff",
      containerLow: isDark ? "#141d19" : "#ffffff",
      container: isDark ? "#18221d" : "#f1f5f2",
      containerHigh: isDark ? "#232c27" : "#e8eee9",
      primary: isDark ? "#34d399" : "#059669",
      primaryBright: isDark ? "#5af0b3" : "#047857",
      primaryLight: isDark ? "rgba(52, 211, 153, 0.15)" : "#ecfdf5",
      textPrimary: isDark ? "#dbe5de" : "#0d1612",
      textSecondary: isDark ? "#85948b" : "#64748b",
      textMuted: isDark ? "#526058" : "#94a3b8",
      borderSubtle: isDark ? "rgba(255, 255, 255, 0.06)" : "#e2e6df",
      borderPrimary: isDark ? "rgba(52, 211, 153, 0.28)" : "rgba(5, 150, 105, 0.35)",
      cardGlow: isDark ? "rgba(52, 211, 153, 0.15)" : "rgba(16, 185, 129, 0.08)",
      grabber: isDark ? "rgba(255, 255, 255, 0.22)" : "rgba(0, 0, 0, 0.18)",
      headerBorder: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)",
      segmentedBg: isDark ? "#07100c" : "#f1f5f2",
      segmentedActiveBg: isDark ? "#232c27" : "#ffffff",
      segmentedActiveBorder: isDark ? "rgba(255, 255, 255, 0.12)" : "#e2e6df",
      segmentedActiveText: isDark ? "#ffffff" : "#0d1612",
      buttonBg: isDark ? "#34d399" : "#059669",
      buttonText: isDark ? "#07100c" : "#ffffff",
    }),
    [isDark]
  );

  const [type, setType] = useState<TransactionType>("expense");
  const [amountValue, setAmountValue] = useState<number>(0);
  const [title, setTitle] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dateModalVisible, setDateModalVisible] = useState(false);

  const amountInputRef = useRef<TextInput>(null);

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
      "Saisissez le montant en FCFA de votre opération et indiquez son libellé.",
      [{ text: "Compris" }]
    );
  };

  const handleToggleRecurring = () => {
    const next = !isRecurring;
    setIsRecurring(next);
    Alert.alert(
      next ? "Répétition activée" : "Répétition désactivée",
      next
        ? "Cette transaction est marquée comme récurrente mensuelle."
        : "Cette transaction est ponctuelle.",
      [{ text: "OK" }]
    );
  };

  const handleSave = async () => {
    if (amountValue <= 0) {
      Alert.alert(
        "Montant manquant",
        "Veuillez saisir un montant supérieur à 0 FCFA."
      );
      amountInputRef.current?.focus();
      return;
    }

    if (!title.trim()) {
      Alert.alert(
        "Libellé manquant",
        "Veuillez saisir un libellé ou commerçant pour cette opération."
      );
      return;
    }

    const now = selectedDate;
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;

    try {
      await addTransaction({
        title: title.trim(),
        amount: amountValue,
        type,
        categoryId: type === "expense" ? "food" : "salary",
        date: toISODate(now),
        time,
        paymentMethod: "cash",
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
    const capitalizedMonth =
      monthStr.charAt(0).toUpperCase() + monthStr.slice(1).replace(".", "");

    if (isToday) {
      return `Aujourd'hui, ${d.getDate()} ${capitalizedMonth}`;
    }
    return `${d.toLocaleDateString("fr-FR", { weekday: "short" })}, ${d.getDate()} ${capitalizedMonth}`;
  };

  const currentTimeStr = `${String(selectedDate.getHours()).padStart(2, "0")}:${String(
    selectedDate.getMinutes()
  ).padStart(2, "0")}`;

  return (
    <SafeAreaView edges={["top", "bottom"]} style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardContainer}
      >
        {/* Poignée de glissement */}
        <View style={styles.grabberWrapper}>
          <View style={[styles.grabber, { backgroundColor: theme.grabber }]} />
        </View>

        {/* En-tête modal : [Annuler] [Nouvelle transaction] [Thème / Aide] */}
        <View
          style={[
            styles.headerRow,
            { borderBottomColor: theme.headerBorder },
          ]}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.headerCancelBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            hitSlop={12}
          >
            <Text style={[styles.headerCancelText, { color: theme.textSecondary }]}>
              Annuler
            </Text>
          </Pressable>

          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            Nouvelle transaction
          </Text>

          <View style={styles.headerRightActions}>
            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => [
                styles.headerActionBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              hitSlop={8}
            >
              <Ionicons
                name={isDark ? "sunny-outline" : "moon-outline"}
                size={20}
                color={theme.textSecondary}
              />
            </Pressable>

            <Pressable
              onPress={handleHelp}
              style={({ pressed }) => [
                styles.headerActionBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
              hitSlop={8}
            >
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={theme.textSecondary}
              />
            </Pressable>
          </View>
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
              {
                backgroundColor: theme.segmentedBg,
                borderColor: theme.borderSubtle,
              },
            ]}
          >
            <Pressable
              onPress={() => setType("expense")}
              style={[
                styles.segmentedBtn,
                type === "expense" && [
                  styles.segmentedBtnActive,
                  {
                    backgroundColor: theme.segmentedActiveBg,
                    borderColor: theme.segmentedActiveBorder,
                  },
                ],
              ]}
            >
              <Text
                style={[
                  styles.segmentedBtnText,
                  {
                    color:
                      type === "expense"
                        ? theme.segmentedActiveText
                        : theme.textSecondary,
                    fontWeight: type === "expense" ? "700" : "500",
                  },
                ]}
              >
                Dépense
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setType("income")}
              style={[
                styles.segmentedBtn,
                type === "income" && [
                  styles.segmentedBtnActive,
                  {
                    backgroundColor: theme.segmentedActiveBg,
                    borderColor: theme.segmentedActiveBorder,
                  },
                ],
              ]}
            >
              <Text
                style={[
                  styles.segmentedBtnText,
                  {
                    color:
                      type === "income"
                        ? theme.segmentedActiveText
                        : theme.textSecondary,
                    fontWeight: type === "income" ? "700" : "500",
                  },
                ]}
              >
                Revenu
              </Text>
            </Pressable>
          </View>

          {/* 2. Carte Hero Montant en FCFA */}
          <View
            style={[
              styles.amountCard,
              {
                backgroundColor: theme.containerLow,
                borderColor: theme.borderPrimary,
                shadowColor: theme.primary,
              },
            ]}
          >
            <View
              style={[styles.glowBlob, { backgroundColor: theme.cardGlow }]}
              pointerEvents="none"
            />

            <View style={styles.amountHeaderRow}>
              <Text style={[styles.amountLabel, { color: theme.textSecondary }]}>
                MONTANT TOTAL
              </Text>

              {/* Badge devise FCFA */}
              <View
                style={[
                  styles.currencyBadge,
                  {
                    backgroundColor: theme.container,
                    borderColor: theme.borderPrimary,
                  },
                ]}
              >
                <View
                  style={[styles.pulsingDot, { backgroundColor: theme.primary }]}
                />
                <Text
                  style={[
                    styles.currencyBadgeText,
                    { color: theme.primaryBright },
                  ]}
                >
                  FCFA
                </Text>
              </View>
            </View>

            {/* Affichage Chiffres Grands Formats */}
            <View style={styles.numericRow}>
              <Pressable
                onPress={() => amountInputRef.current?.focus()}
                style={styles.amountTouchArea}
              >
                <Text
                  style={[
                    styles.amountMainDigits,
                    { color: amountValue === 0 ? theme.textMuted : theme.textPrimary },
                  ]}
                >
                  {formatAmount(amountValue)}
                </Text>
                <Text
                  style={[
                    styles.amountCurrencySymbol,
                    { color: theme.primaryBright },
                  ]}
                >
                  FCFA
                </Text>
              </Pressable>

              {/* Saisie clavier invisible liée à l'affichage */}
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

              {/* Bouton Effacer */}
              <Pressable
                onPress={handleBackspace}
                style={({ pressed }) => [
                  styles.backspaceBtn,
                  {
                    backgroundColor: theme.container,
                    borderColor: theme.borderSubtle,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
                hitSlop={8}
              >
                <Ionicons
                  name="backspace-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              </Pressable>
            </View>

            {/* Touches rapides d'incrément en FCFA */}
            <View
              style={[
                styles.quickPillsRow,
                { borderTopColor: theme.headerBorder },
              ]}
            >
              {[1000, 5000, 10000].map((val) => (
                <Pressable
                  key={val}
                  onPress={() => handleAddQuickAmount(val)}
                  style={({ pressed }) => [
                    styles.quickPill,
                    {
                      backgroundColor: theme.container,
                      borderColor: theme.borderSubtle,
                      opacity: pressed ? 0.7 : 1,
                    },
                  ]}
                >
                  <Text
                    style={[styles.quickPillText, { color: theme.textPrimary }]}
                  >
                    +{formatAmount(val)}
                  </Text>
                </Pressable>
              ))}

              <Pressable
                onPress={handleRoundAmount}
                style={({ pressed }) => [
                  styles.quickPill,
                  {
                    backgroundColor: isDark ? theme.container : theme.primaryLight,
                    borderColor: theme.borderPrimary,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.quickPillArrondirText,
                    { color: theme.primaryBright },
                  ]}
                >
                  Arrondir
                </Text>
              </Pressable>
            </View>
          </View>

          {/* 3. Libellé / Titre & Date */}
          <View style={styles.fieldSection}>
            <Text style={[styles.sectionLabel, { color: theme.textSecondary }]}>
              LIBELLÉ / TITRE
            </Text>
            <View
              style={[
                styles.inputContainer,
                {
                  backgroundColor: theme.containerLowest,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <Ionicons
                name="storefront-outline"
                size={20}
                color={theme.textSecondary}
                style={styles.inputLeftIcon}
              />
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ex: Déjeuner, Taxi, Supermarché, Salaire..."
                placeholderTextColor={theme.textMuted}
                style={[styles.textInputField, { color: theme.textPrimary }]}
              />
            </View>

            {/* Sélecteur de date & récurrence */}
            <View style={styles.dateTimeRow}>
              <Pressable
                onPress={() => setDateModalVisible(true)}
                style={({ pressed }) => [
                  styles.datePillBtn,
                  {
                    backgroundColor: theme.containerLowest,
                    borderColor: theme.borderSubtle,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <View style={styles.datePillLeft}>
                  <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={theme.primary}
                  />
                  <Text
                    style={[styles.datePillText, { color: theme.textPrimary }]}
                  >
                    {getFormattedDateLabel(selectedDate)}
                  </Text>
                </View>
                <View
                  style={[styles.timeBadge, { backgroundColor: theme.container }]}
                >
                  <Text
                    style={[styles.timeBadgeText, { color: theme.textSecondary }]}
                  >
                    {currentTimeStr}
                  </Text>
                </View>
              </Pressable>

              <Pressable
                onPress={handleToggleRecurring}
                style={({ pressed }) => [
                  styles.repeatBtn,
                  {
                    backgroundColor: isRecurring
                      ? theme.container
                      : theme.containerLowest,
                    borderColor: isRecurring
                      ? theme.borderPrimary
                      : theme.borderSubtle,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Ionicons
                  name="repeat"
                  size={20}
                  color={isRecurring ? theme.primary : theme.textSecondary}
                />
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Bouton d'enregistrement fixé en bas */}
        <View
          style={[
            styles.bottomCtaBar,
            {
              backgroundColor: theme.bg,
              borderTopColor: theme.headerBorder,
            },
          ]}
        >
          <Pressable
            onPress={handleSave}
            style={({ pressed }) => [
              styles.submitBtn,
              {
                backgroundColor: theme.buttonBg,
                shadowColor: theme.primary,
                opacity: pressed ? 0.9 : 1,
              },
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={theme.buttonText}
            />
            <Text style={[styles.submitBtnText, { color: theme.buttonText }]}>
              Enregistrer {type === "expense" ? "la dépense" : "le revenu"}
            </Text>
          </Pressable>
        </View>

        {/* Modal de sélection de date rapide */}
        <Modal
          visible={dateModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setDateModalVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setDateModalVisible(false)}
          >
            <View
              style={[
                styles.datePickerSheet,
                {
                  backgroundColor: theme.containerLowest,
                  borderColor: theme.borderSubtle,
                },
              ]}
            >
              <Text
                style={[
                  styles.datePickerSheetTitle,
                  { color: theme.textPrimary },
                ]}
              >
                Choisir la date
              </Text>
              {[
                { label: "Aujourd'hui", offset: 0 },
                { label: "Hier", offset: -1 },
                { label: "Avant-hier", offset: -2 },
                { label: "Il y a 3 jours", offset: -3 },
              ].map((item) => (
                <Pressable
                  key={item.label}
                  onPress={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + item.offset);
                    setSelectedDate(d);
                    setDateModalVisible(false);
                  }}
                  style={[
                    styles.dateOptionRow,
                    { backgroundColor: theme.container },
                  ]}
                >
                  <Text
                    style={[
                      styles.dateOptionText,
                      { color: theme.textPrimary },
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={theme.textSecondary}
                  />
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>
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
  headerRightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  datePickerSheet: {
    width: "100%",
    maxWidth: 320,
    borderRadius: 20,
    borderWidth: 1,
    padding: 18,
    gap: 10,
  },
  datePickerSheetTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },
  dateOptionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  dateOptionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
