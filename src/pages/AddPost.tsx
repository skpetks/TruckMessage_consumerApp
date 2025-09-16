import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Dropdown } from 'react-native-element-dropdown';
import colors from '../components/color';
import { useNavigation } from '@react-navigation/native';
import { saveLoadAvailability } from '../services/loadAvalibility';
import { saveTripDetailLoad } from '../services/tripDetailLoad';
import { LoadAvailabilityType } from '../types/LoadAvailability';
import { TripDetailLoadPayload } from '../types/tripDetailLoad';
import { getTruckTypes, getTruckBodyTypes } from '../services/vehicle';
import { TruckType, TruckBodyType } from '../types/vehicle';

const AddPost = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState<'needs' | 'buySell'>('needs');
  const [selectedNeed, setSelectedNeed] = useState<'truck' | 'load' | null>(null);
  const [isUrgent, setIsUrgent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Common fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fromLocation, setFromLocation] = useState('');
  const [toLocation, setToLocation] = useState('');
  const [date, setDate] = useState('');
  
  // Load specific fields
  const [loadType, setLoadType] = useState('');
  const [weight, setWeight] = useState('');
  const [material, setMaterial] = useState('');
  
  // Truck specific fields
  const [truckType, setTruckType] = useState<TruckType | null>(null);
  const [truckBodyType, setTruckBodyType] = useState<TruckBodyType | null>(null);
  const [numberOfTyres, setNumberOfTyres] = useState('');
  const [capacity, setCapacity] = useState('');
  
  // Dropdown data states
  const [truckTypes, setTruckTypes] = useState<TruckType[]>([]);
  const [truckBodyTypes, setTruckBodyTypes] = useState<TruckBodyType[]>([]);
  const [isLoadingDropdowns, setIsLoadingDropdowns] = useState(false);
  
  // Fetch truck types and truck body types on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      setIsLoadingDropdowns(true);
      try {
        const [truckTypesData, truckBodyTypesData] = await Promise.all([
          getTruckTypes(),
          getTruckBodyTypes()
        ]);
        console.log('Truck Types Data:', truckTypesData);
        console.log('Truck Body Types Data:', truckBodyTypesData);
        setTruckTypes(truckTypesData);
        setTruckBodyTypes(truckBodyTypesData);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
        Alert.alert('Error', 'Failed to load truck types. Please try again.');
      } finally {
        setIsLoadingDropdowns(false);
      }
    };

    fetchDropdownData();
  }, []);

  const handleBack = () => {
    // Navigation back logic
    navigation.goBack();
  };

  const handleClose = () => {
    // Close modal logic
    navigation.goBack();
  };

  const validateForm = () => {
    if (!selectedNeed) {
      Alert.alert('Error', 'Please select what you need (Truck or Load)');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your need');
      return false;
    }
    if (selectedNeed !== 'truck') {
      if (!fromLocation.trim()) {
        Alert.alert('Error', 'Please enter the pickup location');
        return false;
      }
      if (!toLocation.trim()) {
        Alert.alert('Error', 'Please enter the drop location');
        return false;
      }
    }
    if (!date.trim()) {
      Alert.alert('Error', 'Please enter the date');
      return false;
    }

    // Load specific validation
    if (selectedNeed === 'load') {
      if (!loadType.trim()) {
        Alert.alert('Error', 'Please enter the load type');
        return false;
      }
      if (!weight.trim()) {
        Alert.alert('Error', 'Please enter the weight');
        return false;
      }
      if (!material.trim()) {
        Alert.alert('Error', 'Please enter the material type');
        return false;
      }
    }

    // Truck specific validation
    if (selectedNeed === 'truck') {
      if (!truckType) {
        Alert.alert('Error', 'Please select the truck type');
        return false;
      }
      if (!truckBodyType) {
        Alert.alert('Error', 'Please select the truck body type');
        return false;
      }
      if (!capacity.trim()) {
        Alert.alert('Error', 'Please enter the truck capacity');
        return false;
      }
    }


    return true;
  };

  const formatDate = (dateString: string) => {
    // Convert date from DD/MM/YYYY to YYYY-MM-DD format
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
    }
    return dateString;
  };


  const handleAdd = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const currentDate = new Date().toISOString();
      const formattedDate = formatDate(date);

      if (selectedNeed === 'load') {
        // Save as Load Availability
        const loadAvailabilityData = {
          id: 0,
          loadTypeId: 0,
          pickupLocation: fromLocation,
          dropLocation: toLocation,
          availableFrom: new Date(formattedDate).toISOString(),
          availableTo: new Date(formattedDate).toISOString(),
          userId: 0,
          createdAt: currentDate,
          updateAt: currentDate,
          cancel: false,
          cancelledDate: "2025-09-12",
        };

        console.log('Sending Load Availability data:', JSON.stringify(loadAvailabilityData, null, 2));

        await saveLoadAvailability(loadAvailabilityData);
        Alert.alert('Success', 'Load availability posted successfully!');
      } else if (selectedNeed === 'truck') {
        // Save as Trip Detail Load
        const tripDetailLoadData = {
          id: 0, // You can make this dynamic or use 0 for new records
          truck: `${truckType?.name || ''} - ${truckBodyType?.bodyTypeName || ''}`,
          userId: 0, // This should come from user context/auth
          postUserID: 0, // This should come from user context/auth
          organizationName: 'string',
          dealCloseUserID: 0,
          phoneNumber: 'string',
          buyerInformation: title,
          fromLocation: fromLocation || 'N/A',
          toLocation: toLocation || 'N/A',
          material: material,
          ton: parseFloat(capacity) || 0,
          truckBodyType: truckBodyType?.bodyTypeName || '',
          description: description || title,
          numberOfTyres: parseInt(numberOfTyres) || 0,
          createdAt: currentDate,
          updateAt: currentDate,
          recordStatus: 0,
          cancelledDate: '2025-09-12', // You can make this dynamic
        };

        console.log('Sending TripDetailLoad data:', JSON.stringify(tripDetailLoadData, null, 2));

        await saveTripDetailLoad(tripDetailLoadData);
        Alert.alert('Success', 'Truck requirement posted successfully!');
      }

      // Reset form
      setTitle('');
      setDescription('');
      setFromLocation('');
      setToLocation('');
      setDate('');
      setLoadType('');
      setWeight('');
      setMaterial('');
      setTruckType(null);
      setTruckBodyType(null);
      setNumberOfTyres('');
      setCapacity('');
      setSelectedNeed(null);
      setIsUrgent(false);
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error posting:', error);
      Alert.alert('Error', 'Failed to post your requirement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Icon name="x" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Add Section */}
        <Text style={styles.sectionTitle}>Add</Text>

        {/* Tab Selection */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'needs' && styles.activeTab]}
            onPress={() => setSelectedTab('needs')}
          >
            <Icon 
              name="clipboard" 
              size={16} 
              color={selectedTab === 'needs' ? '#fff' : '#000'} 
            />
            <Text style={[styles.tabText, selectedTab === 'needs' && styles.activeTabText]}>
              Needs
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'buySell' && styles.activeTab]}
            onPress={() => setSelectedTab('buySell')}
          >
            <Icon 
              name="tag" 
              size={16} 
              color={selectedTab === 'buySell' ? '#fff' : '#000'} 
            />
            <Text style={[styles.tabText, selectedTab === 'buySell' && styles.activeTabText]}>
              Buy/Sell
            </Text>
          </TouchableOpacity>
        </View>

        {/* I need a section */}
        <Text style={styles.needTitle}>I need a</Text>
        <View style={styles.radioContainer}>
          {['truck', 'load'].map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.radioItem}
              onPress={() => setSelectedNeed(item as 'truck' | 'load')}
            >
              <View style={styles.radioButton}>
                {selectedNeed === item && <View style={styles.radioSelected} />}
              </View>
              <Text style={styles.radioLabel}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Common Input Fields */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Title *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. Need 17 feet vehicle"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Additional details about your requirement"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor="#999"
            multiline
            numberOfLines={3}
          />
        </View>

        {selectedNeed !== 'truck' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pickup Location *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Coimbatore"
                value={fromLocation}
                onChangeText={setFromLocation}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Drop Location *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Chennai"
                value={toLocation}
                onChangeText={setToLocation}
                placeholderTextColor="#999"
              />
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Date *</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g. 02/09/2025"
            value={date}
            onChangeText={setDate}
            placeholderTextColor="#999"
          />
        </View>

        {/* Dynamic Fields based on selected need */}
        {selectedNeed === 'load' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Load Type *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. General Cargo, Container, etc."
                value={loadType}
                onChangeText={setLoadType}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Weight (Tons) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 5"
                value={weight}
                onChangeText={setWeight}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Material Type *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Steel, Food, Electronics, etc."
                value={material}
                onChangeText={setMaterial}
                placeholderTextColor="#999"
              />
            </View>
          </>
        )}

        {selectedNeed === 'truck' && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Truck Type *</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                data={truckTypes}
                search
                maxHeight={300}
                labelField="name"
                valueField="id"
                placeholder={isLoadingDropdowns ? "Loading..." : "Select truck type"}
                searchPlaceholder="Search truck type..."
                value={truckType}
                onChange={item => {
                  setTruckType(item);
                }}
                renderLeftIcon={() => (
                  <Icon
                    style={styles.icon}
                    color="black"
                    name="truck"
                    size={20}
                  />
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Truck Body Type *</Text>
              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                inputSearchStyle={styles.inputSearchStyle}
                iconStyle={styles.iconStyle}
                itemTextStyle={styles.itemTextStyle}
                data={truckBodyTypes}
                search
                maxHeight={300}
                labelField="bodyTypeName"
                valueField="id"
                placeholder={isLoadingDropdowns ? "Loading..." : "Select truck body type"}
                searchPlaceholder="Search truck body type..."
                value={truckBodyType}
                onChange={item => {
                  setTruckBodyType(item);
                }}
                renderLeftIcon={() => (
                  <Icon
                    style={styles.icon}
                    color="black"
                    name="package"
                    size={20}
                  />
                )}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Capacity (Tons) *</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 7.5"
                value={capacity}
                onChangeText={setCapacity}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Number of Tyres</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. 6"
                value={numberOfTyres}
                onChangeText={setNumberOfTyres}
                placeholderTextColor="#999"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Material to Transport</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. General Cargo, Steel, etc."
                value={material}
                onChangeText={setMaterial}
                placeholderTextColor="#999"
              />
            </View>
          </>
        )}


        {/* Urgency Question */}
        <View style={styles.urgencyContainer}>
          <Text style={styles.urgencyQuestion}>Is this requirement urgent?</Text>
          <TouchableOpacity
            style={styles.toggleContainer}
            onPress={() => setIsUrgent(!isUrgent)}
          >
            <View style={[styles.toggle, isUrgent && styles.toggleActive]}>
              <View style={[styles.toggleButton, isUrgent && styles.toggleButtonActive]} />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Add Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.addButton, isLoading && styles.addButtonDisabled]} 
          onPress={handleAdd}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.addButtonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginTop: 20,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#fff',
  },
  needTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  radioContainer: {
    marginBottom: 24,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  radioLabel: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  urgencyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  urgencyQuestion: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    flex: 1,
  },
  toggleContainer: {
    marginLeft: 16,
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: colors.primary,
  },
  toggleButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  toggleButtonActive: {
    alignSelf: 'flex-end',
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  addButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  itemTextStyle: {
    fontSize: 16,
    color: '#000',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default AddPost;