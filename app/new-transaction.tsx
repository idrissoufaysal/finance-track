import React, { useState } from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useFinance } from "@/context/FinanceContext";
import { useTheme } from "@/context/ThemeContext";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from "@/constants/categories";
import { toISODate, formatAmount, CURRENCY_LABEL } from "@/utils/dateUtils";
import { TransactionType, PaymentMethod } from "@/types/finance";

export default function NewTransactionScreen() {
  const router = useRouter();
  const { theme, colors, isDark } = useTheme();
  const { addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>("expense");
  const [amountStr, setAmountStr] = useState("");
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("food");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [note, setNote] = useState("");

  // Categories based on selected type
  const availableCategories =
    type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Make sure current category matches type
  const activeCategoryId = availableCategories.some((c) => c.id === categoryId)
    ? categoryId
    : availableCategories[0].id;

  const handleAddQuickAmount = (val: number) => {
    const current = parseInt(amountStr.replace(/\D/g, ""), 10) || 0;
    setAmountStr(formatAmount(current + val));
  };

  const handleSave = async () => {
    const cleanAmount = parseInt(amountStr.replace(/\D/g, ""), 10);
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      Alert.alert("Montant invalide", "Veuillez saisir un montant positif valide.");
      return;
    }

    if (!title.trim()) {
      Alert.alert("Titre manquant", "Veuillez donner un libellé à cette opération.");
      return;
    }

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    try {
      await addTransaction({
        title: title.trim(),
        amount: cleanAmount,
        type,
        categoryId: activeCategoryId,
        date: toISODate(now),
        time,
        paymentMethod,
        note: note.trim() || undefined,
      });

      router.back();
    } catch (err) {
      Alert.alert("Erreur", "Impossible d'enregistrer la transaction.");
    }
  };

  const paymentMethods: { key: PaymentMethod; label: string; icon: string }[] = [
    { key: "card", label: "Carte", icon: "card-outline" },
    { key: "apple_pay", label: "Apple Pay", icon: "logo-apple" },
    { key: "cash", label: "Espèces", icon: "cash-outline" },
    { key: "transfer", label: "Virement", icon: "swap-horizontal-outline" },
  ];

  const quickPills = [500, 1000, 2000, 5000, 10000];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Type Switcher: Dépense / Revenu */}
        <View style={[styles.typeSwitcher, { backgroundColor: colors.surfaceSecondary }]}>
          <Pressable
            onPress={() => {
              setType("expense");
              setCategoryId("food");
            }}
            style={[
              styles.typeBtn,
              type === "expense" && [
                styles.typeBtnActive,
                { backgroundColor: colors.expense },
              ],
            ]}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={18}
              color={type === "expense" ? "#fff" : colors.textSecondary}
            />
            <Text
              style={[
                styles.typeBtnText,
                { color: type === "expense" ? "#fff" : colors.textSecondary },
                type === "expense" && styles.typeBtnTextActive,
              ]}
            >
              Dépense
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setType("income");
              setCategoryId("salary");
            }}
            style={[
              styles.typeBtn,
              type === "income" && [
                styles.typeBtnActive,
                { backgroundColor: colors.income },
              ],
            ]}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={18}
              color={type === "income" ? "#fff" : colors.textSecondary}
            />
            <Text
              style={[
                styles.typeBtnText,
                { color: type === "income" ? "#fff" : colors.textSecondary },
                type === "income" && styles.typeBtnTextActive,
              ]}
            >
              Revenu
            </Text>
          </Pressable>
        </View>

        {/* Big Amount Input Card */}
        <View
          style={[
            styles.amountCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Montant de l'opération
          </Text>
          <View style={styles.amountRow}>
            <TextInput
              placeholder="0"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              value={amountStr}
              onChangeText={(t) => {
                const digits = t.replace(/\D/g, "");
                setAmountStr(digits ? formatAmount(parseInt(digits, 10)) : "");
              }}
              style={[
                styles.amountInput,
                {
                  color: type === "expense" ? colors.expense : colors.income,
                  fontVariant: ["tabular-nums"],
                },
              ]}
              autoFocus
            />
            <Text
              style={[
                styles.currencySymbol,
                { color: type === "expense" ? colors.expense : colors.income },
              ]}
            >
              {CURRENCY_LABEL}
            </Text>
          </View>

          {/* Quick Increment Pills */}
          <View style={styles.quickPillsRow}>
            {quickPills.map((val) => (
              <Pressable
                key={val}
                onPress={() => handleAddQuickAmount(val)}
                style={({ pressed }) => [
                  styles.quickPill,
                  {
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.border,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={[styles.quickPillText, { color: colors.text }]}>
                  +{formatAmount(val)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Title Input Card */}
        <View
          style={[
            styles.inputCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Libellé / Titre
          </Text>
          <TextInput
            placeholder="Ex: Déjeuner, Courses Monoprix, Salaire..."
            placeholderTextColor={colors.textMuted}
            value={title}
            onChangeText={setTitle}
            style={[styles.textInput, { color: colors.text }]}
          />
        </View>

        {/* Category Picker Grid */}
        <View
          style={[
            styles.inputCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Choisir une catégorie
          </Text>
          <View style={styles.categoryGrid}>
            {availableCategories.map((cat) => {
              const isSelected = activeCategoryId === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  style={[
                    styles.catGridItem,
                    {
                      backgroundColor: isSelected
                        ? cat.color + "25"
                        : colors.surfaceSecondary,
                      borderColor: isSelected ? cat.color : "transparent",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.catIconPill,
                      { backgroundColor: isSelected ? cat.color : cat.color + "20" },
                    ]}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={18}
                      color={isSelected ? "#fff" : cat.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.catGridName,
                      { color: isSelected ? colors.text : colors.textSecondary },
                      isSelected && { fontWeight: "700" },
                    ]}
                    numberOfLines={1}
                  >
                    {cat.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Payment Method Selector */}
        <View
          style={[
            styles.inputCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Moyen de paiement
          </Text>
          <View style={styles.paymentRow}>
            {paymentMethods.map((pm) => {
              const isSelected = paymentMethod === pm.key;
              return (
                <Pressable
                  key={pm.key}
                  onPress={() => setPaymentMethod(pm.key)}
                  style={[
                    styles.paymentPill,
                    {
                      backgroundColor: isSelected
                        ? colors.tint
                        : colors.surfaceSecondary,
                    },
                  ]}
                >
                  <Ionicons
                    name={pm.icon as any}
                    size={14}
                    color={isSelected ? "#fff" : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.paymentPillText,
                      { color: isSelected ? "#fff" : colors.textSecondary },
                      isSelected && { fontWeight: "700" },
                    ]}
                  >
                    {pm.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Note / Description */}
        <View
          style={[
            styles.inputCard,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>
            Note complémentaire (facultatif)
          </Text>
          <TextInput
            placeholder="Détails, restaurant, référence..."
            placeholderTextColor={colors.textMuted}
            value={note}
            onChangeText={setNote}
            style={[styles.textInput, { color: colors.text }]}
          />
        </View>

        {/* Submit Button */}
        <Pressable
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveBtn,
            {
              backgroundColor: type === "expense" ? colors.expense : colors.income,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>
            Enregistrer {type === "expense" ? "la dépense" : "le revenu"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 48,
    gap: 14,
  },
  typeSwitcher: {
    flexDirection: "row",
    borderRadius: 14,
    padding: 4,
    gap: 4,
  },
  typeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  typeBtnActive: {
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  typeBtnTextActive: {
    fontWeight: "700",
  },
  amountCard: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "center",
    marginVertical: 4,
  },
  amountInput: {
    fontSize: 40,
    fontWeight: "800",
    textAlign: "center",
    minWidth: 120,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: "700",
    marginLeft: 4,
  },
  quickPillsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  quickPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickPillText: {
    fontSize: 12,
    fontWeight: "600",
  },
  inputCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  textInput: {
    fontSize: 15,
    paddingVertical: 4,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 4,
  },
  catGridItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
  },
  catIconPill: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  catGridName: {
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  paymentRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 4,
  },
  paymentPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  paymentPillText: {
    fontSize: 13,
    fontWeight: "500",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
