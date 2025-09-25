import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

interface TripExpense {
  id: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

const TripAccounts: React.FC = () => {
  const [tripName, setTripName] = useState<string>('');
  const [expenses, setExpenses] = useState<TripExpense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: '',
    amount: '',
    description: '',
  });

  const addExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.description) {
      Alert.alert('Error', 'Please fill in all expense fields');
      return;
    }

    const expense: TripExpense = {
      id: Date.now().toString(),
      category: newExpense.category,
      amount: parseFloat(newExpense.amount),
      description: newExpense.description,
      date: new Date().toLocaleDateString(),
    };

    setExpenses([...expenses, expense]);
    setNewExpense({ category: '', amount: '', description: '' });
  };

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const getTotalExpenses = () => {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  };

  const getCategoryTotal = (category: string) => {
    return expenses
      .filter(expense => expense.category === category)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  const categories = ['Fuel', 'Toll', 'Food', 'Maintenance', 'Other'];

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="file-text" size={24} color="#6B46C1" />
        </View>
        <Text style={styles.title}>Trip Accounts</Text>
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Manage and track your trip accounts, expenses, and earnings.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Trip Name</Text>
          <TextInput
            style={styles.input}
            value={tripName}
            onChangeText={setTripName}
            placeholder="Enter trip name"
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.addExpenseContainer}>
          <Text style={styles.sectionTitle}>Add New Expense</Text>
          
          <View style={styles.inputRow}>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Category</Text>
              <TextInput
                style={styles.input}
                value={newExpense.category}
                onChangeText={(text) => setNewExpense({...newExpense, category: text})}
                placeholder="e.g., Fuel"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputHalf}>
              <Text style={styles.label}>Amount (₹)</Text>
              <TextInput
                style={styles.input}
                value={newExpense.amount}
                onChangeText={(text) => setNewExpense({...newExpense, amount: text})}
                placeholder="0"
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              value={newExpense.description}
              onChangeText={(text) => setNewExpense({...newExpense, description: text})}
              placeholder="Enter expense description"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addExpense}>
            <Text style={styles.addButtonText}>Add Expense</Text>
          </TouchableOpacity>
        </View>

        {expenses.length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.sectionTitle}>Trip Summary</Text>
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total Expenses:</Text>
              <Text style={styles.totalValue}>₹{getTotalExpenses().toFixed(2)}</Text>
            </View>

            <View style={styles.categoryBreakdown}>
              <Text style={styles.breakdownTitle}>Category Breakdown:</Text>
              {categories.map(category => {
                const categoryTotal = getCategoryTotal(category);
                if (categoryTotal > 0) {
                  return (
                    <View key={category} style={styles.categoryItem}>
                      <Text style={styles.categoryName}>{category}</Text>
                      <Text style={styles.categoryAmount}>₹{categoryTotal.toFixed(2)}</Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
          </View>
        )}

        {expenses.length > 0 && (
          <View style={styles.expensesContainer}>
            <Text style={styles.sectionTitle}>Expense History</Text>
            {expenses.map(expense => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                  <Text style={styles.expenseDescription}>{expense.description}</Text>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                </View>
                <View style={styles.expenseActions}>
                  <Text style={styles.expenseAmount}>₹{expense.amount}</Text>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteExpense(expense.id)}
                  >
                    <Icon name="trash-2" size={16} color="#DC2626" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {expenses.length > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              Alert.alert(
                'Reset Trip',
                'Are you sure you want to clear all expenses?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', onPress: () => setExpenses([]) },
                ]
              );
            }}
          >
            <Text style={styles.resetButtonText}>Reset Trip</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default TripAccounts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  inputHalf: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
  },
  addExpenseContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  summaryContainer: {
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#10B981',
  },
  categoryBreakdown: {
    marginTop: 12,
  },
  breakdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
    marginBottom: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  categoryName: {
    fontSize: 14,
    color: '#059669',
  },
  categoryAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  expensesContainer: {
    marginBottom: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  expenseDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  expenseDate: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  expenseActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
  },
  deleteButton: {
    padding: 4,
  },
  resetButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
