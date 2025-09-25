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
import color, { hexToRgba } from '../components/colors';
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
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
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

  // Function to toggle card details
  const toggleCardDetails = (cardId: number) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cardId)) {
        newSet.delete(cardId);
      } else {
        newSet.add(cardId);
      }
      return newSet;
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[color.primaryDark, color.primaryDark]}
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
              color={selectedTab === 'needs' ? color.textLight : color.primaryLight}
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
              color={selectedTab === 'buysell' ? color.textLight : color.primaryLight}
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
              <Icon name="search" size={18} color={color.textLightGray} />
              <TextInput
                placeholder="Search"
                style={styles.searchInput}
                placeholderTextColor={color.textMuted}
                value={searchKeyword}
                onChangeText={setSearchKeyword}
              />
            </View>
            <TouchableOpacity 
              style={styles.filterButton}
              onPress={() => setShowFilterPopup(true)}
            >
              <Icon name="sliders" size={18} color={color.primaryLight} />
            </TouchableOpacity>
          </View>


          {/* Loading State */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={color.secondaryLight} />
              <Text style={styles.loadingText}>Loading opportunities...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={24} color={color.iconDanger} />
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

              return (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.newCard}
                  onPress={() => toggleCardDetails(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.newCardHeader}>
                    <View style={styles.newCardHeaderLeft}>
                      <Text style={styles.newCardTitle}>
                        {item.itemTypeID === 1 ? 'Part-load required' : 'Truck required'}
                      </Text>
                      <Text style={styles.newCardTime}>{timeAgo}</Text>
                    </View>
                    <View style={item.itemTypeID === 1 ? styles.newCardIcon : styles.truckCardIcon}>
                      <Icon 
                        name={item.itemTypeID === 1 ? "box" : "truck"} 
                        size={20} 
                        color={item.itemTypeID === 1 ? color.iconWarning : color.iconSuccess} 
                      />
                    </View>
                  </View>

                  <View style={styles.newCardRoute}>
                    <Icon name="map-pin" size={14} color={color.iconDanger} />
                    <Text style={styles.newCardRouteText}>
                      {item.pickupLocation || 'N/A'} → {item.dropLocation || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.newCardDivider} />

                  <View style={styles.newCardDetails}>
                    <View style={styles.newCardDetailItem}>
                      <Text style={styles.newCardDetailLabel}>WHEN?</Text>
                      <Text style={styles.newCardDetailValue}>
                        {formatDate(availableFrom)}
                      </Text>
                    </View>
                    <View style={styles.newCardDetailItem}>
                      <Text style={styles.newCardDetailLabel}>MATERIAL</Text>
                      <Text style={styles.newCardDetailValue}>
                        {item.itemTypeID === 1 ? 'Any' : 'Electronics'}
                      </Text>
                    </View>
                    <View style={styles.newCardDetailItem}>
                      <Text style={styles.newCardDetailLabel}>WEIGHT</Text>
                      <Text style={styles.newCardDetailValue}>
                        {item.itemTypeID === 1 ? '2 Tons' : '15 Tons'}
                      </Text>
                    </View>
                  </View>

                  {!expandedCards.has(item.id) && (
                    <TouchableOpacity 
                      style={styles.newDetailsButton}
                      onPress={() => toggleCardDetails(item.id)}
                    >
                      <Text style={styles.newDetailsButtonText}>Details</Text>
                    </TouchableOpacity>
                  )}

                  {expandedCards.has(item.id) && (
                    <View style={styles.postFooter}>
                      <View style={styles.posterInfo}>
                        <Text style={styles.posterName}>
                          {item.itemTypeID === 1 ? `User ${item.userId}` : `Owner ${item.userId}`}
                        </Text>
                        <View style={styles.ratingContainer}>
                          {[...Array(5)].map((_, i) => (
                            <Icon key={i} name="star" size={12} color={color.rating} />
                          ))}
                        </View>
                      </View>
                      <View style={styles.actionButtons}>
                        <TouchableOpacity style={styles.actionButton}>
                          <Icon name="phone" size={16} color={color.textLight} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, { backgroundColor: color.buttonDisabled }]}
                        >
                          <Icon name="message-circle" size={16} color={color.textLight} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}

          {/* No Data Message */}
          {!loading &&
            !error &&
            marketplaceData &&
            Array.isArray(marketplaceData) &&
            marketplaceData.length === 0 && (
              <View style={styles.noDataContainer}>
                <Icon name="package" size={48} color={color.textLightGray} />
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
          <Icon name="plus" size={24} color={color.textLight} />
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
                      color={isActive ? color.primaryLight : color.textLightGray}
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
                placeholderTextColor={color.textMuted}
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
                placeholderTextColor={color.textMuted}
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
                    placeholderTextColor={color.textMuted}
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
    backgroundColor: color.primaryDark,
    paddingTop: 40,
  },
  gradientContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: color.backgroundWhite,
  },

  // Header
  header: {
    backgroundColor: color.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: color.textDark,
  },

  // Segmented Control
  segmentedContainer: {
    flexDirection: 'row',
    backgroundColor: color.backgroundWhite,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 12,
    padding: 4,
    shadowColor: color.shadow,
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
    backgroundColor: color.primaryDark,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: color.primaryDark,
    marginLeft: 6,
  },
  segmentTextActive: {
    color: color.textLight,
  },

  // Search Container
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: color.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.border,
    marginRight: 12,
    marginTop: 5,
  },
  searchInput: {
    marginLeft: 8,
    flex: 1,
    fontSize: 16,
    color: color.textDark,
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: color.backgroundWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: color.primaryLight,
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
    backgroundColor: color.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: color.border,
    shadowColor: color.shadow,
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
    color: color.textDark,
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
    color: color.textDark,
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
    color: color.textDark,
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
    backgroundColor: color.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: color.shadow,
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
    color: color.textLight,
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
    backgroundColor: color.backgroundWhite,
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
    color: color.textDark,
    marginBottom: 8,
  },
  filterInput: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: color.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: color.textDark,
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
    borderColor: color.primaryLight,
    backgroundColor: color.backgroundWhite,
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
    color: color.textLight,
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
    borderColor: color.primaryLight,
    backgroundColor: color.backgroundWhite,
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
    color: color.textLight,
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
    borderColor: color.primaryLight,
    backgroundColor: color.backgroundWhite,
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
    color: color.textLight,
    fontWeight: '600',
  },

  // New Card Styles (matching Home page)
  newCard: {
    backgroundColor: color.backgroundWhite,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: color.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  newCardHeaderLeft: {
    flex: 1,
  },
  newCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: color.textDark,
    marginBottom: 4,
  },
  newCardTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  newCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  truckCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  newCardRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newCardRouteText: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textDark,
    marginLeft: 6,
  },
  newCardDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  newCardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  newCardDetailItem: {
    flex: 1,
  },
  newCardDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontWeight: '500',
  },
  newCardDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textDark,
  },
  newDetailsButton: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 16,
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  newDetailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textDark,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  posterInfo: {
    flex: 1,
  },
  posterName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
