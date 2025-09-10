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
import { saveLoadAvailability } from '../services/loadAvalibility';
import { LoadAvailabilityType } from '../types/LoadAvailability';

const PostLoad = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  
  const [form, setForm] = useState({
    loadTypeId: '',
    pickupLocation: '',
    dropLocation: '',
    availableFrom: new Date(),
    availableTo: new Date(),
    userId: '',
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
    if (!form.loadTypeId || !form.pickupLocation || !form.dropLocation || !form.userId) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (form.availableFrom >= form.availableTo) {
      Alert.alert('Error', 'Available From date must be before Available To date');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        id: 0, // Will be set by backend
        loadTypeId: parseInt(form.loadTypeId),
        pickupLocation: form.pickupLocation,
        dropLocation: form.dropLocation,
        availableFrom: form.availableFrom.toISOString(),
        availableTo: form.availableTo.toISOString(),
        userId: parseInt(form.userId),
        createdAt: new Date().toISOString(),
        updateAt: new Date().toISOString(),
        cancel: false,
        cancelledDate: '',
      };

      const result = await saveLoadAvailability(payload);
      Alert.alert('Success', 'Load availability posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to post load availability');
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
        <Text style={styles.title}>Post Load Availability</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Load Information</Text>
          
          {/* Load Type ID */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Load Type ID *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="package" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter load type ID"
                placeholderTextColor="#9CA3AF"
                value={form.loadTypeId}
                onChangeText={(text) => handleChange('loadTypeId', text)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Pickup Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Pickup Location *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="map-pin" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter pickup location"
                placeholderTextColor="#9CA3AF"
                value={form.pickupLocation}
                onChangeText={(text) => handleChange('pickupLocation', text)}
              />
            </View>
          </View>

          {/* Drop Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Drop Location *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="map-pin" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter drop location"
                placeholderTextColor="#9CA3AF"
                value={form.dropLocation}
                onChangeText={(text) => handleChange('dropLocation', text)}
              />
            </View>
          </View>

          {/* User ID */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>User ID *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="user" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter user ID"
                placeholderTextColor="#9CA3AF"
                value={form.userId}
                onChangeText={(text) => handleChange('userId', text)}
                keyboardType="numeric"
              />
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

          {/* Route Display */}
          <View style={styles.routeContainer}>
            <View style={styles.routeLine}>
              <View style={styles.routeDot}>
                <Icon name="map-pin" size={12} color={color.primary} />
              </View>
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>From</Text>
                <Text style={styles.routeLocation}>{form.pickupLocation || 'Pickup location'}</Text>
              </View>
            </View>
            
            <View style={styles.routeConnector} />
            
            <View style={styles.routeLine}>
              <View style={styles.routeDot}>
                <Icon name="map-pin" size={12} color={color.secondary} />
              </View>
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>To</Text>
                <Text style={styles.routeLocation}>{form.dropLocation || 'Drop location'}</Text>
              </View>
            </View>
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
                <Text style={styles.submitButtonText}>Post Load Availability</Text>
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

export default PostLoad;

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
  routeContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  routeTextContainer: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 2,
  },
  routeLocation: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  routeConnector: {
    width: 2,
    height: 20,
    backgroundColor: '#CBD5E1',
    marginLeft: 11,
    marginBottom: 16,
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