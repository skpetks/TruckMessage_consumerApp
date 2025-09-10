import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Feather';
import color from '../components/color';
import { saveDriverAvailability } from '../services/driverAvailability';
import { DriverAvailabilityType } from '../types/DriverAvailability';

const PostDriver = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  
  const [form, setForm] = useState({
    driverId: '',
    isAvailable: true,
    currentLocation: '',
    availableFrom: new Date(),
    availableTo: new Date(),
  });

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined, type: 'from' | 'to') => {
    if (selectedDate) {
      if (type === 'from') {
        handleChange('availableFrom', selectedDate);
        setShowFromDatePicker(false);
      } else {
        handleChange('availableTo', selectedDate);
        setShowToDatePicker(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleSubmit = async () => {
    if (!form.driverId || !form.currentLocation) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (form.availableFrom >= form.availableTo) {
      Alert.alert('Error', 'Available From date must be before Available To date');
      return;
    }

    setLoading(true);
    try {
      const payload: DriverAvailabilityType = {
        id: 0, // Will be set by backend
        driverId: parseInt(form.driverId),
        isAvailable: form.isAvailable,
        currentLocation: form.currentLocation,
        availableFrom: form.availableFrom.toISOString(),
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        recordStatus: 1,
        cancelledDate: '',
      };

      const result = await saveDriverAvailability(payload);
      Alert.alert('Success', 'Driver availability posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to post driver availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Post Driver Availability</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Driver Information</Text>
          
          {/* Driver ID */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Driver ID *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="user" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter driver ID"
                placeholderTextColor="#9CA3AF"
                value={form.driverId}
                onChangeText={(text) => handleChange('driverId', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Current Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Current Location *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="map-pin" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter current location"
                placeholderTextColor="#9CA3AF"
                value={form.currentLocation}
                onChangeText={(text) => handleChange('currentLocation', text)}
              />
            </View>
          </View>

          {/* Availability Toggle */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Availability Status</Text>
            <View style={styles.toggleContainer}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  form.isAvailable && styles.toggleButtonActive
                ]}
                onPress={() => handleChange('isAvailable', true)}
              >
                <Icon 
                  name="check-circle" 
                  size={16} 
                  color={form.isAvailable ? "#fff" : "#6B7280"} 
                />
                <Text style={[
                  styles.toggleButtonText,
                  form.isAvailable && styles.toggleButtonTextActive
                ]}>
                  Available
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !form.isAvailable && styles.toggleButtonActive
                ]}
                onPress={() => handleChange('isAvailable', false)}
              >
                <Icon 
                  name="x-circle" 
                  size={16} 
                  color={!form.isAvailable ? "#fff" : "#6B7280"} 
                />
                <Text style={[
                  styles.toggleButtonText,
                  !form.isAvailable && styles.toggleButtonTextActive
                ]}>
                  Not Available
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Available From */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Available From *</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowFromDatePicker(true)}
            >
              <Icon name="calendar" size={18} color="#6B7280" style={styles.inputIcon} />
              <Text style={styles.datePickerText}>
                {formatDate(form.availableFrom)}
              </Text>
              <Icon name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Available To */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Available To *</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowToDatePicker(true)}
            >
              <Icon name="calendar" size={18} color="#6B7280" style={styles.inputIcon} />
              <Text style={styles.datePickerText}>
                {formatDate(form.availableTo)}
              </Text>
              <Icon name="chevron-down" size={18} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Post Availability</Text>
                <Icon name="send" size={16} color="#fff" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showFromDatePicker && (
        <DateTimePicker
          value={form.availableFrom}
          mode="datetime"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, 'from')}
          minimumDate={new Date()}
        />
      )}

      {showToDatePicker && (
        <DateTimePicker
          value={form.availableTo}
          mode="datetime"
          display="default"
          onChange={(event, date) => handleDateChange(event, date, 'to')}
          minimumDate={form.availableFrom}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default PostDriver;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundLight,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },
  toggleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  toggleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  toggleButtonActive: {
    backgroundColor: color.primary,
    borderColor: color.primary,
  },
  toggleButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  toggleButtonTextActive: {
    color: '#fff',
  },
  datePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  datePickerText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 12,
  },
  submitButton: {
    backgroundColor: color.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginLeft: 4,
  },
});