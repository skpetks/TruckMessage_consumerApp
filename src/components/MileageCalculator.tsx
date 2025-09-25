import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const MileageCalculator: React.FC = () => {
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [fuelEfficiency, setFuelEfficiency] = useState<string>('');
  const [mileage, setMileage] = useState<string>('');

  const calculateMileage = () => {
    if (!fromLocation || !toLocation || !fuelEfficiency) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const efficiency = parseFloat(fuelEfficiency);

    if (efficiency <= 0) {
      Alert.alert('Error', 'Please enter a valid fuel efficiency value');
      return;
    }

    // For this example, we'll calculate based on a sample distance
    // In a real app, you'd calculate the actual distance between locations
    const sampleDistance = 250; // km
    const fuelNeeded = sampleDistance / efficiency;
    setMileage(fuelNeeded.toFixed(2));
  };

  const resetCalculator = () => {
    setFromLocation('');
    setToLocation('');
    setFuelEfficiency('');
    setMileage('');
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Mileage calculator</Text>
        <TouchableOpacity style={styles.closeButton}>
          <Icon name="x" size={20} color="#000" />
        </TouchableOpacity>
      </View> */}

      <View style={styles.content}>
        {/* Information Banner */}
        <View style={styles.infoBanner}>
          <Icon name="info" size={20} color="#2563EB" />
          <Text style={styles.infoText}>Not sure how? Tap to learn.</Text>
        </View>

        {/* From Location Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>From location</Text>
          <TextInput
            style={styles.input}
            value={fromLocation}
            onChangeText={setFromLocation}
            placeholder="e.g. Coimbatore"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* To Location Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>To location</Text>
          <TextInput
            style={styles.input}
            value={toLocation}
            onChangeText={setToLocation}
            placeholder="e.g. Chennai"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        {/* Fuel Efficiency Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fuel efficiency of the vehicle</Text>
          <View style={styles.inputWithUnit}>
            <TextInput
              style={styles.inputWithUnitField}
              value={fuelEfficiency}
              onChangeText={setFuelEfficiency}
              placeholder="e.g. 10"
              keyboardType="numeric"
              placeholderTextColor="#9CA3AF"
            />
            <Text style={styles.unitText}>KMS / LITRE</Text>
          </View>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity style={styles.calculateButton} onPress={calculateMileage}>
          <Text style={styles.calculateButtonText}>Calculate mileage</Text>
        </TouchableOpacity>

        {/* Result Display */}
        {mileage && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Fuel needed for trip:</Text>
            <Text style={styles.resultValue}>{mileage} liters</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default MileageCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: '#2563EB',
    marginLeft: 8,
    fontWeight: '500',
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
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },
  inputWithUnit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputWithUnitField: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  unitText: {
    fontSize: 14,
    color: '#9CA3AF',
    fontWeight: '500',
    marginLeft: 8,
  },
  calculateButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  resultContainer: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  resultLabel: {
    fontSize: 16,
    color: '#059669',
    marginBottom: 8,
    fontWeight: '500',
  },
  resultValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
});