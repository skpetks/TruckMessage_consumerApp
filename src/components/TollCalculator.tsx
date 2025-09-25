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
import color from './colors';
import font from './font';

const TollCalculator: React.FC = () => {
  const [fromLocation, setFromLocation] = useState<string>('');
  const [toLocation, setToLocation] = useState<string>('');
  const [vehicleType, setVehicleType] = useState<string>('car');
  const [axleCount, setAxleCount] = useState<string>('');
  const [totalToll, setTotalToll] = useState<number>(0);

  const calculateToll = () => {
    if (!fromLocation || !toLocation || !vehicleType) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Sample toll calculation based on vehicle type and route
    const baseToll = 50; // Base toll amount
    let multiplier = 1;

    switch (vehicleType) {
      case 'car':
        multiplier = 1;
        break;
      case 'lcv':
        multiplier = 1.5;
        break;
      case 'bus':
        multiplier = 2;
        break;
    }

    // Add axle count multiplier if selected
    if (axleCount) {
      switch (axleCount) {
        case 'upto3':
          multiplier *= 1;
          break;
        case '4-6':
          multiplier *= 1.5;
          break;
        case '7+':
          multiplier *= 2;
          break;
        case 'hcm':
          multiplier *= 2.5;
          break;
      }
    }

    const calculatedToll = baseToll * multiplier;
    setTotalToll(calculatedToll);
  };

  const resetCalculator = () => {
    setFromLocation('');
    setToLocation('');
    setVehicleType('car');
    setAxleCount('');
    setTotalToll(0);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.title}>Toll calculator</Text>
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

        {/* Vehicle Type Selection */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select vehicle type</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                vehicleType === 'car' && styles.selectionButtonActive,
              ]}
              onPress={() => setVehicleType('car')}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  vehicleType === 'car' && styles.selectionButtonTextActive,
                ]}
              >
                Car/Jeep / Van / SUV
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                vehicleType === 'lcv' && styles.selectionButtonActive,
              ]}
              onPress={() => setVehicleType('lcv')}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  vehicleType === 'lcv' && styles.selectionButtonTextActive,
                ]}
              >
                LCV
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                vehicleType === 'bus' && styles.selectionButtonActive,
              ]}
              onPress={() => setVehicleType('bus')}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  vehicleType === 'bus' && styles.selectionButtonTextActive,
                ]}
              >
                Bus
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Axle Count Selection */}
        <View style={styles.inputContainer}>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                axleCount === 'upto3' && styles.selectionButtonActive,
              ]}
              onPress={() => setAxleCount('upto3')}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  axleCount === 'upto3' && styles.selectionButtonTextActive,
                ]}
              >
                Upto 3 axle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                axleCount === '4-6' && styles.selectionButtonActive,
              ]}
              onPress={() => setAxleCount('4-6')}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  axleCount === '4-6' && styles.selectionButtonTextActive,
                ]}
              >
                4-6 axle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                axleCount === '7+' && styles.selectionButtonActive,
              ]}
              onPress={() => setAxleCount('7+')}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  axleCount === '7+' && styles.selectionButtonTextActive,
                ]}
              >
                7 or more axles
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[
                styles.selectionButton,
                axleCount === 'hcm' && styles.selectionButtonActive,
              ]}
              onPress={() => setAxleCount('hcm')}
            >
              <Text
                style={[
                  styles.selectionButtonText,
                  axleCount === 'hcm' && styles.selectionButtonTextActive,
                ]}
              >
                HCM/EME
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Calculate Button */}
        <TouchableOpacity style={styles.calculateButton} onPress={calculateToll}>
          <Text style={styles.calculateButtonText}>Calculate toll</Text>
        </TouchableOpacity>

        {/* Result Display */}
        {totalToll > 0 && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>Total Toll Charges:</Text>
            <Text style={styles.resultValue}>₹{totalToll}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default TollCalculator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundWhite,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: color.backgroundWhite,
  },
  title: {
    fontFamily: font.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: color.textDark,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: color.backgroundLightGray,
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
    backgroundColor: color.backgroundCard,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 24,
  },
  infoText: {
    fontFamily: font.fontFamily,
    fontSize: 14,
    color: color.secondaryLight,
    marginLeft: 8,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: color.textDark,
    marginBottom: 8,
  },
  input: {
    backgroundColor: color.backgroundWhite,
    borderWidth: 1,
    borderColor: color.borderGray,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontFamily: font.fontFamily,
    fontSize: 16,
    color: color.textDark,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  selectionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: color.primaryLight,
    backgroundColor: color.backgroundWhite,
    alignItems: 'center',
  },
  selectionButtonActive: {
    borderColor: color.primaryLight,
    backgroundColor: color.backgroundWhite,
  },
  selectionButtonText: {
    fontFamily: font.fontFamily,
    fontSize: 12,
    fontWeight: '500',
    color: color.primaryLight,
    textAlign: 'center',
  },
  selectionButtonTextActive: {
    color: color.primaryLight,
    fontWeight: '600',
  },
  calculateButton: {
    backgroundColor: color.primaryLight,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  calculateButtonText: {
    fontFamily: font.fontFamily,
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
    fontFamily: font.fontFamily,
    fontSize: 16,
    color: '#059669',
    marginBottom: 8,
    fontWeight: '500',
  },
  resultValue: {
    fontFamily: font.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: '#10B981',
  },
});
