// src/screens/OpportunitiesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { hexToRgba } from '../components/color';
import { getMarketPlaceList } from '../services/marketplace';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MarketPlaceItem } from '../types/MarketPlace';
import LinearGradient from 'react-native-linear-gradient';

type Opportunity = {
  id: string;
  type: string;
  urgent?: boolean;
  rating: number;
  title: string;
  details: { label: string; value: string }[];
  price: string;
  company: string;
  timeAgo: string;
  icon: string;
  iconColor: string;
};

const filters = [
  { id: 0, label: 'All', icon: 'infinity' },
  { id: 1, label: 'Truck', icon: 'truck' },
  { id: 2, label: 'Load', icon: 'package' },
];

const postedTimeFilters = [
  { id: 'all', label: 'All' },
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This week' },
  { id: 'month', label: 'This month' },
];

const truckSizeFilters = [
  { id: '10ft', label: '10 ft' },
  { id: '15ft', label: '15 ft' },
  { id: '17ft', label: '17 ft' },
  { id: '22ft', label: '22 ft' },
];

const tyreCountFilters = [
  { id: '10', label: '10' },
  { id: '12', label: '12' },
  { id: '14', label: '14' },
  { id: '16', label: '16' },
  { id: '18', label: '18' },
  { id: '24', label: '24' },
];

const tonCapacityFilters = [
  { id: '<5', label: '<5' },
  { id: '10', label: '10' },
  { id: '20', label: '20' },
  { id: '40', label: '40' },
  { id: '>40', label: '>40' },
];

const loadWeightFilters = [
  { id: '10ft', label: '10 ft' },
  { id: '15ft', label: '15 ft' },
  { id: '17ft', label: '17 ft' },
  { id: '22ft', label: '22 ft' },
];

// Helper functions
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const MarketPlace: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'needs' | 'buysell'>('needs');
  const [marketplaceData, setMarketplaceData] = useState<MarketPlaceItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<number>(0); // 0: All, 1: Truck, 2: Driver, 3: Load
  const [showFilterPopup, setShowFilterPopup] = useState<boolean>(false);
  const [origin, setOrigin] = useState<string>('Coimbatore');
  const [destination, setDestination] = useState<string>('Chennai');
  const [selectedPostedTime, setSelectedPostedTime] = useState<string>('all');
  const [truckBodyType, setTruckBodyType] = useState<string>('');
  const [selectedTruckSize, setSelectedTruckSize] = useState<string>('');
  const [selectedTyreCount, setSelectedTyreCount] = useState<string>('16');
  const [selectedTonCapacity, setSelectedTonCapacity] = useState<string>('');
  const [selectedLoadWeight, setSelectedLoadWeight] = useState<string>('');
  const navigation = useNavigation();

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMarketPlaceList(searchKeyword, selectedFilter);
      console.log('Marketplace data:', data);

      // The API already handles filtering based on filterType, so use the data directly
      setMarketplaceData(data);
    } catch (err) {
      console.error('Error fetching marketplace data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchMarketplaceData();
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchKeyword, selectedFilter]);

  // Reload data when screen comes back into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchMarketplaceData();
    }, []),
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#3902A1', '#3902A1']}
        locations={[0, 0.5]}
        style={styles.gradientContainer}
      >
        {/* Header */}
        {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
      </View>
       */}
        {/* Segmented Control */}
        <View style={styles.segmentedContainer}>
          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedTab === 'needs' && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedTab('needs')}
          >
            <Icon
              name="list"
              size={16}
              color={selectedTab === 'needs' ? '#fff' : '#8B5CF6'}
            />
            <Text
              style={[
                styles.segmentText,
                selectedTab === 'needs' && styles.segmentTextActive,
              ]}
            >
              Needs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.segmentButton,
              selectedTab === 'buysell' && styles.segmentButtonActive,
            ]}
            onPress={() => setSelectedTab('buysell')}
          >
            <Icon
              name="tag"
              size={16}
              color={selectedTab === 'buysell' ? '#fff' : '#8B5CF6'}
            />
            <Text
              style={[
                styles.segmentText,
                selectedTab === 'buysell' && styles.segmentTextActive,
              ]}
            >
              Buy/Sell
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Icon name="search" size={18} color="#666" />
              <TextInput
                placeholder="Search"
                style={styles.searchInput}
                placeholderTextColor="#888"
                value={searchKeyword}
                onChangeText={setSearchKeyword}
              />
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterPopup(true)}
            >
              <Icon name="sliders" size={18} color="#8B5CF6" />
            </TouchableOpacity>
          </View>


          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.loadingText}>Loading opportunities...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={24} color="#dc2626" />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => {
                  fetchMarketplaceData();
                }}
              >
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Marketplace Cards */}
          {!loading &&
            !error &&
            marketplaceData &&
            Array.isArray(marketplaceData) &&
            marketplaceData.length > 0 &&
            marketplaceData.map(item => {
              // Add null checks for date fields
              const availableFrom = item.availableFrom
                ? new Date(item.availableFrom)
                : new Date();
              const availableTo = item.availableTo
                ? new Date(item.availableTo)
                : new Date();
              const timeAgo = getTimeAgo(availableFrom);

              // Determine icon and color based on loadTypeId
              const getIconAndColor = (loadTypeId: number) => {
                switch (loadTypeId) {
                  case 1: // Load
                    return { icon: 'package', color: '#2563eb' };
                  case 2: // Truck
                    return { icon: 'truck', color: '#22c55e' };
                  default:
                    return { icon: 'box', color: '#666' };
                }
              };

              const { icon, color } = getIconAndColor(item.itemTypeID);

              return (
                <View key={item.id} style={styles.card}>
                  {/* Card Header with Icon and Title */}
                  <View style={styles.cardHeader}>
                    <View style={styles.cardIconContainer}>
                      <Icon name={icon} size={20} color={color} />
                    </View>
                    <View style={styles.cardTitleContainer}>
                      <Text style={styles.cardTitle}>
                        {item.itemTypeID === 1 ? 'Part-load' : 'Driver'}
                      </Text>
                      <Text style={styles.cardTimeAgo}>{timeAgo}</Text>
                    </View>
                  </View>

                  {/* Location */}
                  <View style={styles.locationRow}>
                    <Icon name="map-pin" size={14} color="#dc2626" />
                    <Text style={styles.locationText}>
                      {item.pickupLocation || 'N/A'} →{' '}
                      {item.dropLocation || 'N/A'}
                    </Text>
                  </View>

                  {/* Details */}
                  <View style={styles.detailsContainer}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>WHEN?</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(availableFrom)}
                      </Text>
                    </View>
                    {item.itemTypeID === 1 ? (
                      <>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>MATERIAL</Text>
                          <Text style={styles.detailValue}>Any</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <Text style={styles.detailLabel}>WEIGHT</Text>
                          <Text style={styles.detailValue}>2 Tons</Text>
                        </View>
                      </>
                    ) : (
                      <View style={styles.detailItem}>
                        <Text style={styles.detailLabel}>TRUCK</Text>
                        <Text style={styles.detailValue}>TATA Ace Pro EV</Text>
                      </View>
                    )}
                  </View>

                  {/* Contact Information */}
                  <View style={styles.contactRow}>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>
                        {item.itemTypeID === 1
                          ? 'Muthu kumar'
                          : 'Pandiarajan K'}
                      </Text>
                      <View style={styles.ratingContainer}>
                        <Icon name="star" size={12} color="#fbbf24" />
                        <Icon name="star" size={12} color="#fbbf24" />
                        <Icon name="star" size={12} color="#fbbf24" />
                        <Icon name="star" size={12} color="#fbbf24" />
                        <Icon name="star" size={12} color="#fbbf24" />
                      </View>
                    </View>
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.phoneButton}>
                        <Icon name="phone" size={16} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.messageButton}>
                        <Icon name="message-circle" size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}

          {/* No Data Message */}
          {!loading &&
            !error &&
            marketplaceData &&
            Array.isArray(marketplaceData) &&
            marketplaceData.length === 0 && (
              <View style={styles.noDataContainer}>
                <Icon name="package" size={48} color="#ccc" />
                <Text style={styles.noDataText}>
                  No marketplace items found
                </Text>
                <Text style={styles.noDataSubtext}>
                  Check back later for new opportunities
                </Text>
              </View>
            )}
        </ScrollView>

        {/* Floating Add Button */}
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            // Handle add new post action
            console.log('Add new post pressed');
            navigation.navigate('AddPost' as never);
          }}
        >
          <Icon name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Filter Popup Modal */}
      <Modal
        visible={showFilterPopup}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterPopup(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView style={styles.modalContainer} showsVerticalScrollIndicator={false}>
            {/* Category Filters */}
            <View style={styles.popupCategoryFilters}>
              {filters.map(chip => {
                const chipFilterType = parseInt(chip.id.toString());
                const isActive = selectedFilter === chipFilterType;

                return (
                  <TouchableOpacity
                    key={chip.id}
                    style={styles.popupCategoryFilter}
                    onPress={() => setSelectedFilter(chipFilterType)}
                  >
                    <Icon
                      name={chip.icon}
                      size={16}
                      color={isActive ? '#8B5CF6' : '#666'}
                      style={{ marginBottom: 4 }}
                    />
                    <Text
                      style={[
                        styles.popupCategoryFilterText,
                        isActive && styles.popupCategoryFilterTextActive,
                      ]}
                    >
                      {chip.label}
                    </Text>
                    {isActive && <View style={styles.popupCategoryFilterUnderline} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Origin Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Origin</Text>
              <TextInput
                style={styles.filterInput}
                value={origin}
                onChangeText={setOrigin}
                placeholder="Enter origin"
                placeholderTextColor="#999"
              />
            </View>

            {/* Destination Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Destination</Text>
              <TextInput
                style={styles.filterInput}
                value={destination}
                onChangeText={setDestination}
                placeholder="Enter destination"
                placeholderTextColor="#999"
              />
            </View>

            {/* Dynamic Filters based on selected category */}
            {selectedFilter === 1 && ( // Truck filters
              <>
                {/* Truck Size Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Truck size</Text>
                  <View style={styles.filterButtonRow}>
                    {truckSizeFilters.map(sizeFilter => {
                      const isActive = selectedTruckSize === sizeFilter.id;
                      return (
                        <TouchableOpacity
                          key={sizeFilter.id}
                          style={[
                            styles.filterOptionButton,
                            isActive && styles.filterOptionButtonActive,
                          ]}
                          onPress={() => setSelectedTruckSize(sizeFilter.id)}
                        >
                          <Text
                            style={[
                              styles.filterOptionButtonText,
                              isActive && styles.filterOptionButtonTextActive,
                            ]}
                          >
                            {sizeFilter.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Truck Body Type Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Truck body type</Text>
                  <TextInput
                    style={styles.filterInput}
                    value={truckBodyType}
                    onChangeText={setTruckBodyType}
                    placeholder="e.g. Open body"
                    placeholderTextColor="#999"
                  />
                </View>

                {/* Number of Tyres Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Number of tyres</Text>
                  <View style={styles.filterButtonRow}>
                    {tyreCountFilters.map(tyreFilter => {
                      const isActive = selectedTyreCount === tyreFilter.id;
                      return (
                        <TouchableOpacity
                          key={tyreFilter.id}
                          style={[
                            styles.filterOptionButton,
                            isActive && styles.filterOptionButtonActive,
                          ]}
                          onPress={() => setSelectedTyreCount(tyreFilter.id)}
                        >
                          <Text
                            style={[
                              styles.filterOptionButtonText,
                              isActive && styles.filterOptionButtonTextActive,
                            ]}
                          >
                            {tyreFilter.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>

                {/* Ton Capacity Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Ton</Text>
                  <View style={styles.filterButtonRow}>
                    {tonCapacityFilters.map(tonFilter => {
                      const isActive = selectedTonCapacity === tonFilter.id;
                      return (
                        <TouchableOpacity
                          key={tonFilter.id}
                          style={[
                            styles.filterOptionButton,
                            isActive && styles.filterOptionButtonActive,
                          ]}
                          onPress={() => setSelectedTonCapacity(tonFilter.id)}
                        >
                          <Text
                            style={[
                              styles.filterOptionButtonText,
                              isActive && styles.filterOptionButtonTextActive,
                            ]}
                          >
                            {tonFilter.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {selectedFilter === 2 && ( // Load filters
              <>
                {/* Load Weight Filter */}
                <View style={styles.filterSection}>
                  <Text style={styles.filterLabel}>Load weight</Text>
                  <View style={styles.filterButtonRow}>
                    {loadWeightFilters.map(weightFilter => {
                      const isActive = selectedLoadWeight === weightFilter.id;
                      return (
                        <TouchableOpacity
                          key={weightFilter.id}
                          style={[
                            styles.filterOptionButton,
                            isActive && styles.filterOptionButtonActive,
                          ]}
                          onPress={() => setSelectedLoadWeight(weightFilter.id)}
                        >
                          <Text
                            style={[
                              styles.filterOptionButtonText,
                              isActive && styles.filterOptionButtonTextActive,
                            ]}
                          >
                            {weightFilter.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </View>
              </>
            )}

            {/* Posted Time Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Posted</Text>
              <View style={styles.postedTimeFilters}>
                {postedTimeFilters.map(timeFilter => {
                  const isActive = selectedPostedTime === timeFilter.id;
                  return (
                    <TouchableOpacity
                      key={timeFilter.id}
                      style={[
                        styles.postedTimeFilter,
                        isActive && styles.postedTimeFilterActive,
                      ]}
                      onPress={() => setSelectedPostedTime(timeFilter.id)}
                    >
                      <Text
                        style={[
                          styles.postedTimeFilterText,
                          isActive && styles.postedTimeFilterTextActive,
                        ]}
                      >
                        {timeFilter.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.filterActions}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => {
                  setSelectedFilter(0);
                  setOrigin('');
                  setDestination('');
                  setSelectedPostedTime('all');
                  setTruckBodyType('');
                  setSelectedTruckSize('');
                  setSelectedTyreCount('16');
                  setSelectedTonCapacity('');
                  setSelectedLoadWeight('');
                  setShowFilterPopup(false);
                }}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  setShowFilterPopup(false);
                  // Apply filters logic here
                }}
              >
                <Text style={styles.applyButtonText}>Filter</Text>
              </TouchableOpacity>
             </View>
           </ScrollView>
         </View>
       </Modal>
    </View>
  );
};

export default MarketPlace;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3902A1',
    paddingTop: 40,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },

  // Header
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },

  // Segmented Control
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  segmentButtonActive: {
    backgroundColor: '#3902A1',
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3902A1',
    marginLeft: 6,
  },
  segmentTextActive: {
    color: '#fff',
  },

  // Search Container
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 12,
    marginTop: 5,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  // Category Filters
  categoryFilters: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'space-around',
  },
  categoryFilter: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    position: 'relative',
  },
  categoryFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  categoryFilterTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  categoryFilterUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#8B5CF6',
    borderRadius: 1,
  },

  // Cards
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  cardTimeAgo: {
    fontSize: 12,
    color: '#666',
  },

  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 6,
  },

  // Details
  detailsContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  // Contact Information
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneButton: {
    width: 36,
    height: 36,
    backgroundColor: '#10b981',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageButton: {
    width: 36,
    height: 36,
    backgroundColor: '#374151',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Floating Button
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#3902A1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // No Data State
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    textAlign: 'center',
  },
  noDataSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },

  // Filter Popup Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },

  // Popup Category Filters
  popupCategoryFilters: {
    flexDirection: 'row',
    marginBottom: 24,
    justifyContent: 'space-around',
  },
  popupCategoryFilter: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  popupCategoryFilterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  popupCategoryFilterTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  popupCategoryFilterUnderline: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#8B5CF6',
    borderRadius: 1,
  },

  // Filter Sections
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000',
  },

  // Filter Button Rows
  filterButtonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOptionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    backgroundColor: '#fff',
    minWidth: 60,
    alignItems: 'center',
  },
  filterOptionButtonActive: {
    backgroundColor: '#8B5CF6',
  },
  filterOptionButtonText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  filterOptionButtonTextActive: {
    color: '#fff',
  },

  // Posted Time Filters
  postedTimeFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  postedTimeFilter: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    backgroundColor: '#fff',
  },
  postedTimeFilterActive: {
    backgroundColor: '#8B5CF6',
  },
  postedTimeFilterText: {
    fontSize: 14,
    color: '#8B5CF6',
    fontWeight: '500',
  },
  postedTimeFilterTextActive: {
    color: '#fff',
  },

  // Action Buttons
  filterActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 12,
  },
  clearButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#8B5CF6',
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
