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
import { saveTripDetailLoad } from '../services/tripDetailLoad';
import { TripDetailLoadPayload } from '../types/tripDetailLoad';

const PostTruck = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const [form, setForm] = useState({
    truck: '',
    userId: '',
    postUserID: '',
    organizationName: '',
    dealCloseUserID: '',
    phoneNumber: '',
    buyerInformation: '',
    fromLocation: '',
    toLocation: '',
    material: '',
    ton: '',
    truckBodyType: '',
    description: '',
    numberOfTyres: '',
    createdAt: new Date(),
  });

  const handleChange = (key: string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleDateChange = (event: any, selectedDate: Date | undefined) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('createdAt', selectedDate);
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
    if (!form.truck || !form.userId || !form.phoneNumber || !form.fromLocation || !form.toLocation) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const payload: TripDetailLoadPayload = {
        id: 0, // Will be set by backend
        truck: form.truck,
        userId: parseInt(form.userId),
        postUserID: parseInt(form.postUserID) || 0,
        organizationName: form.organizationName,
        dealCloseUserID: parseInt(form.dealCloseUserID) || 0,
        phoneNumber: form.phoneNumber,
        buyerInformation: form.buyerInformation,
        fromLocation: form.fromLocation,
        toLocation: form.toLocation,
        material: form.material,
        ton: parseFloat(form.ton) || 0,
        truckBodyType: form.truckBodyType,
        description: form.description,
        numberOfTyres: parseInt(form.numberOfTyres) || 0,
        createdAt: form.createdAt.toISOString(),
        updateAt: new Date().toISOString(),
        recordStatus: 1,
        cancelledDate: '',
      };

      const result = await saveTripDetailLoad(payload);
      Alert.alert('Success', 'Truck availability posted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to post truck availability');
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
        <Text style={styles.title}>Post Truck Availability</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Truck Information</Text>
          
          {/* Truck Details */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Truck Number *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="truck" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter truck number"
                placeholderTextColor="#9CA3AF"
                value={form.truck}
                onChangeText={(text) => handleChange('truck', text)}
                autoCapitalize="characters"
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

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="phone" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                value={form.phoneNumber}
                onChangeText={(text) => handleChange('phoneNumber', text)}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Organization Name */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Organization Name</Text>
            <View style={styles.inputWrapper}>
              <Icon name="building" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter organization name"
                placeholderTextColor="#9CA3AF"
                value={form.organizationName}
                onChangeText={(text) => handleChange('organizationName', text)}
              />
            </View>
          </View>

          {/* From Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>From Location *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="map-pin" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter pickup location"
                placeholderTextColor="#9CA3AF"
                value={form.fromLocation}
                onChangeText={(text) => handleChange('fromLocation', text)}
              />
            </View>
          </View>

          {/* To Location */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>To Location *</Text>
            <View style={styles.inputWrapper}>
              <Icon name="map-pin" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter drop location"
                placeholderTextColor="#9CA3AF"
                value={form.toLocation}
                onChangeText={(text) => handleChange('toLocation', text)}
              />
            </View>
          </View>

          {/* Material */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Material</Text>
            <View style={styles.inputWrapper}>
              <Icon name="package" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter material type"
                placeholderTextColor="#9CA3AF"
                value={form.material}
                onChangeText={(text) => handleChange('material', text)}
              />
            </View>
          </View>

          {/* Weight and Truck Details Row */}
          <View style={styles.rowContainer}>
            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Weight (Ton)</Text>
              <View style={styles.inputWrapper}>
                <Icon name="weight" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0.0"
                  placeholderTextColor="#9CA3AF"
                  value={form.ton}
                  onChangeText={(text) => handleChange('ton', text)}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            <View style={styles.halfInputContainer}>
              <Text style={styles.inputLabel}>Number of Tyres</Text>
              <View style={styles.inputWrapper}>
                <Icon name="circle" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#9CA3AF"
                  value={form.numberOfTyres}
                  onChangeText={(text) => handleChange('numberOfTyres', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </View>

          {/* Truck Body Type */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Truck Body Type</Text>
            <View style={styles.inputWrapper}>
              <Icon name="truck" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g., Open, Closed, Container"
                placeholderTextColor="#9CA3AF"
                value={form.truckBodyType}
                onChangeText={(text) => handleChange('truckBodyType', text)}
              />
            </View>
          </View>

          {/* Buyer Information */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Buyer Information</Text>
            <View style={styles.inputWrapper}>
              <Icon name="info" size={18} color="#6B7280" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Enter buyer information"
                placeholderTextColor="#9CA3AF"
                value={form.buyerInformation}
                onChangeText={(text) => handleChange('buyerInformation', text)}
              />
            </View>
          </View>

          {/* Description */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <View style={styles.textAreaWrapper}>
              <TextInput
                style={styles.textArea}
                placeholder="Additional details about the truck availability"
                placeholderTextColor="#9CA3AF"
                value={form.description}
                onChangeText={(text) => handleChange('description', text)}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Date */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Available Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Icon name="calendar" size={18} color="#6B7280" style={styles.inputIcon} />
              <Text style={styles.datePickerText}>
                {formatDate(form.createdAt)}
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
                <Text style={styles.routeLocation}>{form.fromLocation || 'Pickup location'}</Text>
              </View>
            </View>
            
            <View style={styles.routeConnector} />
            
            <View style={styles.routeLine}>
              <View style={styles.routeDot}>
                <Icon name="map-pin" size={12} color={color.secondary} />
              </View>
              <View style={styles.routeTextContainer}>
                <Text style={styles.routeLabel}>To</Text>
                <Text style={styles.routeLocation}>{form.toLocation || 'Drop location'}</Text>
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
                <Text style={styles.submitButtonText}>Post Truck Availability</Text>
                <Icon name="send" size={16} color="#fff" style={styles.buttonIcon} />
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={form.createdAt}
          mode="datetime"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default PostTruck;

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
  rowContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  halfInputContainer: {
    flex: 1,
  },
  textAreaWrapper: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  textArea: {
    fontSize: 14,
    color: '#111827',
    minHeight: 80,
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