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
import color from './colors';
import font from './font';

interface PetrolStation {
  id: string;
  name: string;
  location: string;
  distance: number;
  price: number;
  rating: number;
  amenities: string[];
}

const PrimePetrolBunks: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [fuelType, setFuelType] = useState<string>('petrol');
  const [stations, setStations] = useState<PetrolStation[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Sample petrol stations data
  const sampleStations: PetrolStation[] = [
    {
      id: '1',
      name: 'Indian Oil Corporation',
      location: 'Avinashi Road, Coimbatore',
      distance: 2.5,
      price: 96.5,
      rating: 4.5,
      amenities: ['ATM', 'Restaurant', 'Car Wash'],
    },
    {
      id: '2',
      name: 'Bharat Petroleum',
      location: 'Trichy Road, Coimbatore',
      distance: 3.2,
      price: 96.2,
      rating: 4.3,
      amenities: ['ATM', 'Store'],
    },
    {
      id: '3',
      name: 'Hindustan Petroleum',
      location: 'Mettupalayam Road, Coimbatore',
      distance: 4.1,
      price: 96.8,
      rating: 4.7,
      amenities: ['ATM', 'Restaurant', 'Car Wash', 'Air'],
    },
    {
      id: '4',
      name: 'Reliance Petroleum',
      location: 'Sathy Road, Coimbatore',
      distance: 5.3,
      price: 95.9,
      rating: 4.2,
      amenities: ['ATM', 'Store', 'Car Wash'],
    },
    {
      id: '5',
      name: 'Shell India',
      location: 'Gandhipuram, Coimbatore',
      distance: 1.8,
      price: 97.2,
      rating: 4.8,
      amenities: ['ATM', 'Restaurant', 'Car Wash', 'Air', 'Store'],
    },
  ];

  const searchStations = () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Please enter your current location');
      return;
    }

    setIsSearching(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Sort by distance and show top 5
      const sortedStations = [...sampleStations]
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5);
      
      setStations(sortedStations);
      setIsSearching(false);
    }, 1500);
  };

  const getFuelTypePrice = (station: PetrolStation) => {
    const basePrice = station.price;
    if (fuelType === 'diesel') {
      return basePrice - 2; // Diesel is typically cheaper
    }
    return basePrice;
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={12} color={color.rating} />);
    }

    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star" size={12} color={color.rating} />);
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Icon key={`empty-${i}`} name="star" size={12} color={color.border} />);
    }

    return stars;
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Icon name="droplet" size={24} color={color.iconPrimary} />
        </View>
        <Text style={styles.title}>Prime Petrol Bunks</Text>
      </View> */}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>
          Find the best petrol bunks with quality fuel and competitive prices.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Location</Text>
          <TextInput
            style={styles.input}
            value={currentLocation}
            onChangeText={setCurrentLocation}
            placeholder="Enter your current location"
            placeholderTextColor={color.textMuted}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Fuel Type</Text>
          <View style={styles.fuelTypeContainer}>
            {['petrol', 'diesel'].map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.fuelTypeButton,
                  fuelType === type && styles.fuelTypeButtonActive,
                ]}
                onPress={() => setFuelType(type)}
              >
                <Text
                  style={[
                    styles.fuelTypeText,
                    fuelType === type && styles.fuelTypeTextActive,
                  ]}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
          onPress={searchStations}
          disabled={isSearching}
        >
          <Text style={styles.searchButtonText}>
            {isSearching ? 'Searching...' : 'Find Stations'}
          </Text>
        </TouchableOpacity>

        {stations.length > 0 && (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Nearby Petrol Stations</Text>
            {stations.map((station) => (
              <View key={station.id} style={styles.stationCard}>
                <View style={styles.stationHeader}>
                  <View style={styles.stationInfo}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationLocation}>{station.location}</Text>
                  </View>
                  <View style={styles.stationRating}>
                    <View style={styles.starsContainer}>
                      {renderStars(station.rating)}
                    </View>
                    <Text style={styles.ratingText}>{station.rating}</Text>
                  </View>
                </View>

                <View style={styles.stationDetails}>
                  <View style={styles.detailItem}>
                    <Icon name="navigation" size={16} color={color.textSecondary} />
                    <Text style={styles.detailText}>{station.distance} km away</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Icon name="dollar-sign" size={16} color={color.textSecondary} />
                    <Text style={styles.detailText}>
                      ₹{getFuelTypePrice(station)} per liter
                    </Text>
                  </View>
                </View>

                <View style={styles.amenitiesContainer}>
                  <Text style={styles.amenitiesTitle}>Amenities:</Text>
                  <View style={styles.amenitiesList}>
                    {station.amenities.map((amenity, index) => (
                      <View key={index} style={styles.amenityTag}>
                        <Text style={styles.amenityText}>{amenity}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.directionsButton}>
                  <Icon name="navigation" size={16} color={color.iconPrimary} />
                  <Text style={styles.directionsButtonText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {stations.length > 0 && (
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setStations([]);
              setCurrentLocation('');
            }}
          >
            <Text style={styles.resetButtonText}>New Search</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
};

export default PrimePetrolBunks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: color.backgroundGray,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.backgroundLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontFamily: font.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: color.textDark,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    color: color.textSecondary,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
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
    backgroundColor: color.backgroundGray,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontFamily: font.fontFamily,
    fontSize: 16,
    color: color.textDark,
  },
  fuelTypeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  fuelTypeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: color.backgroundWhite,
    alignItems: 'center',
  },
  fuelTypeButtonActive: {
    backgroundColor: '#6B46C1',
    borderColor: '#6B46C1',
  },
  fuelTypeText: {
    fontFamily: font.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: color.textSecondary,
  },
  fuelTypeTextActive: {
    color: '#fff',
  },
  searchButton: {
    backgroundColor: '#6B46C1',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6B46C1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  searchButtonText: {
    fontFamily: font.fontFamily,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resultsContainer: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontFamily: font.fontFamily,
    fontSize: 18,
    fontWeight: '700',
    color: color.textDark,
    marginBottom: 16,
  },
  stationCard: {
    backgroundColor: color.backgroundGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: color.textDark,
    marginBottom: 4,
  },
  stationLocation: {
    fontFamily: font.fontFamily,
    fontSize: 14,
    color: color.textSecondary,
  },
  stationRating: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  ratingText: {
    fontFamily: font.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: color.textSecondary,
  },
  stationDetails: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontFamily: font.fontFamily,
    fontSize: 14,
    color: color.textSecondary,
  },
  amenitiesContainer: {
    marginBottom: 12,
  },
  amenitiesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textDark,
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityTag: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amenityText: {
    fontSize: 12,
    color: color.textSecondary,
    fontWeight: '500',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.backgroundLightGray,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  directionsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B46C1',
  },
  resetButton: {
    backgroundColor: color.backgroundLightGray,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: color.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
});
