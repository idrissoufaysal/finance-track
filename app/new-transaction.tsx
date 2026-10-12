import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFinance } from '@/context/FinanceContext';
import { useColorScheme } from '@/components/useColorScheme';
import Colors, { Palette } from '@/constants/Colors';
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
} from '@/constants/categories';
import { toISODate } from '@/utils/dateUtils';
import { TransactionType, PaymentMethod } from '@/types/finance';

export default function NewTransactionScreen() {
  const router = useRouter();
  const theme = useColorScheme();
  const colors = Colors[theme];
  const { addTransaction } = useFinance();

  const [type, setType] = useState<TransactionType>('expense');
  const [amountStr, setAmountStr] = useState('');
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('food');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [note, setNote] = useState('');

  // Categories based on selected type
  const availableCategories =
    type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Make sure current category matches type
  const activeCategoryId = availableCategories.some((c) => c.id === categoryId)
    ? categoryId
    : availableCategories[0].id;

  const handleSave = async () => {
    const cleanAmount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(cleanAmount) || cleanAmount <= 0) {
      Alert.alert('Montant invalide', 'Veuillez saisir un montant positif valide.');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Titre manquant', 'Veuillez donner un libellé à cette opération.');
      return;
    }

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

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
      Alert.alert('Erreur', "Impossible d'enregistrer la transaction.");
    }
  };

  const paymentMethods: { key: PaymentMethod; label: string; icon: string }[] = [
    { key: 'card', label: 'Carte', icon: 'card-outline' },
    { key: 'apple_pay', label: 'Apple Pay', icon: 'logo-apple' },
    { key: 'cash', label: 'Espèces', icon: 'cash-outline' },
    { key: 'transfer', label: 'Virement', icon: 'swap-horizontal-outline' },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
              setType('expense');
              setCategoryId('food');
            }}
            style={[
              styles.typeBtn,
              type === 'expense' && [
                styles.typeBtnActive,
                { backgroundColor: colors.expense },
              ],
            ]}
          >
            <Ionicons
              name="arrow-up-circle-outline"
              size={18}
              color={type === 'expense' ? '#fff' : colors.textSecondary}
            />
            <Text
              style={[
                styles.typeBtnText,
                { color: type === 'expense' ? '#fff' : colors.textSecondary },
                type === 'expense' && styles.typeBtnTextActive,
              ]}
            >
              Dépense
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setType('income');
              setCategoryId('salary');
            }}
            style={[
              styles.typeBtn,
              type === 'income' && [
                styles.typeBtnActive,
                { backgroundColor: colors.income },
              ],
            ]}
          >
            <Ionicons
              name="arrow-down-circle-outline"
              size={18}
              color={type === 'income' ? '#fff' : colors.textSecondary}
            />
            <Text
              style={[
                styles.typeBtnText,
                { color: type === 'income' ? '#fff' : colors.textSecondary },
                type === 'income' && styles.typeBtnTextActive,
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
            Montant de l\'opération
          </Text>
          <View style={styles.amountRow}>
            <TextInput
              placeholder="0,00"
              placeholderTextColor={colors.textMuted}
              keyboardType="decimal-pad"
              value={amountStr}
              onChangeText={setAmountStr}
              style={[
                styles.amountInput,
                {
                  color: type === 'expense' ? colors.expense : colors.income,
                  fontVariant: ['tabular-nums'],
                },
              ]}
              autoFocus
            />
            <Text
              style={[
                styles.currencySymbol,
                { color: type === 'expense' ? colors.expense : colors.income },
              ]}
            >
              €
            </Text>
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
                        ? cat.color + '25'
                        : colors.surfaceSecondary,
                      borderColor: isSelected ? cat.color : 'transparent',
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.catIconPill,
                      { backgroundColor: isSelected ? cat.color : cat.color + '20' },
                    ]}
                  >
                    <Ionicons
                      name={cat.icon as any}
                      size={18}
                      color={isSelected ? '#fff' : cat.color}
                    />
                  </View>
                  <Text
                    style={[
                      styles.catGridName,
                      { color: isSelected ? colors.text : colors.textSecondary },
                      isSelected && { fontWeight: '700' },
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
                    color={isSelected ? '#fff' : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.paymentPillText,
                      { color: isSelected ? '#fff' : colors.textSecondary },
                      isSelected && { fontWeight: '700' },
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
              backgroundColor: type === 'expense' ? colors.expense : colors.income,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.saveBtnText}>
            Enregistrer {type === 'expense' ? 'la dépense' : 'le revenu'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 16,
  },
  typeSwitcher: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 4,
    gap: 6,
  },
  typeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  typeBtnActive: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  typeBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  typeBtnTextActive: {
    fontWeight: '700',
  },
  amountCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    fontSize: 40,
    fontWeight: '800',
    flex: 1,
  },
  currencySymbol: {
    fontSize: 32,
    fontWeight: '700',
    marginLeft: 8,
  },
  inputCard: {
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
  },
  textInput: {
    fontSize: 15,
    paddingVertical: 6,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  catGridItem: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  catIconPill: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  catGridName: {
    fontSize: 11,
    textAlign: 'center',
  },
  paymentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 6,
  },
  paymentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 6,
  },
  paymentPillText: {
    fontSize: 13,
    fontWeight: '500',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 18,
    gap: 8,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
