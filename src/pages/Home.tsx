// src/screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import MetrialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../components/CustomHeader';
import { hexToRgba } from '../components/color';
import MileageCalculator from '../components/MileageCalculator';
import TollCalculator from '../components/TollCalculator';
import TripAccounts from '../components/TripAccounts';
import PrimePetrolBunks from '../components/PrimePetrolBunks';
import {
  getLoadAvailabilities,
  getLoadAvailabilityById,
} from '../services/loadAvalibility';
import { LoadAvailabilityType } from '../types/LoadAvailability';
import {
  getDriverAvailability,
  getDriverAvailabilityById,
} from '../services/driverAvailability';
import { getTripDetailLoads } from '../services/tripDetailLoad';
import { getMarketPlaceList } from '../services/marketplace';
import { MarketPlaceItem } from '../types/MarketPlace';
import { Image } from 'react-native-svg';

type ServiceCard = {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  buttonText: string;
  backgroundColor: string;
};

type UtilityIcon = {
  id: string;
  icon: React.ReactElement;
  label: string;
};

type RecentPost = {
  id: string;
  title: string;
  timeAgo: string;
  route: string;
  details: { label: string; value: string }[];
  posterName: string;
  rating: number;
};

const serviceCards: ServiceCard[] = [
  {
    id: '1',
    title: 'FASTag recharge',
    badge: '5 Low',
    badgeColor: '#dc2626',
    buttonText: 'Recharge now >',
    backgroundColor: '#ffffff',
  },
  {
    id: '2',
    title: 'Insurance renewal',
    badge: '2 Due',
    badgeColor: '#dc2626',
    buttonText: 'Renew now >',
    backgroundColor: '#ffffff',
  },
];

const utilityIcons: UtilityIcon[] = [
  {
    id: '1',
    icon: <MetrialIcons name="speed" size={24} color="#6B46C1" />,
    label: 'Mileage calculator',
  },
  {
    id: '2',
    icon: <MetrialIcons name="toll" size={24} color="#6B46C1" />,
    label: 'Toll calculator',
  },
  {
    id: '3',
    icon: <Icon name="file-text" size={24} color="#6B46C1" />,
    label: 'Trip accounts',
  },
  {
    id: '4',
    icon: <Icon name="droplet" size={24} color="#6B46C1" />,
    label: 'Prime petrol bunks',
  },
];

// Helper function to format time ago
const getTimeAgo = (dateString: string): string => {
  const now = new Date();
  const postDate = new Date(dateString);
  const diffInHours = Math.floor(
    (now.getTime() - postDate.getTime()) / (1000 * 60 * 60),
  );

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [loads, setLoads] = useState<LoadAvailabilityType[]>([]);
  const [marketplaceData, setMarketplaceData] = useState<MarketPlaceItem[]>([]);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [showUtilityPopup, setShowUtilityPopup] = useState<boolean>(false);
  const [selectedUtility, setSelectedUtility] = useState<UtilityIcon | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [loadsData, marketplaceList] = await Promise.all([
        getLoadAvailabilities(),
        getMarketPlaceList('', 0), // Empty keyword and filterType 0 for all items
      ]);
      setLoads(loadsData);
      setMarketplaceData(marketplaceList);
    } catch (err) {
      console.error('❌ API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoadAvailabilityById = async () => {
    setLoading(true);
    try {
      const data = await getLoadAvailabilityById(2);
      // setLoad(data);
    } catch (err) {
      console.error('❌ API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriverAvailability = async () => {
    setLoading(true);
    try {
      const data = await getDriverAvailability();
      console.log('data', data);
      // setDrivers(data);
    } catch (err) {
      console.error('❌ API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDriver = async () => {
    setLoading(true);
    try {
      const data = await getDriverAvailabilityById(1);
      console.log('data', data);
      // setDriver(data);
    } catch (err) {
      console.error('❌ API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLoads = async () => {
    setLoading(true);
    try {
      const data = await getTripDetailLoads();
      console.log('data', data);
      // setLoads(data);
    } catch (err) {
      console.error('❌ API Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to render load card
  const renderLoadCard = (item: MarketPlaceItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.newCard}
      onPress={() => toggleCardDetails(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.newCardHeader}>
        <View style={styles.newCardHeaderLeft}>
          <Text style={styles.newCardTitle}>Part-load required</Text>
          <Text style={styles.newCardTime}>{getTimeAgo(item.createdAt)}</Text>
        </View>
        <View style={styles.newCardIcon}>
          <Icon name="box" size={20} color="#F59E0B" />
        </View>
      </View>

      <View style={styles.newCardRoute}>
        <Icon name="map-pin" size={14} color="#dc2626" />
        <Text style={styles.newCardRouteText}>
          {item.pickupLocation} → {item.dropLocation}
        </Text>
      </View>

      <View style={styles.newCardDivider} />

      <View style={styles.newCardDetails}>
        <View style={styles.newCardDetailItem}>
          <Text style={styles.newCardDetailLabel}>WHEN?</Text>
          <Text style={styles.newCardDetailValue}>
            {formatDate(item.availableFrom)}
          </Text>
        </View>
        <View style={styles.newCardDetailItem}>
          <Text style={styles.newCardDetailLabel}>MATERIAL</Text>
          <Text style={styles.newCardDetailValue}>Any</Text>
        </View>
        <View style={styles.newCardDetailItem}>
          <Text style={styles.newCardDetailLabel}>WEIGHT</Text>
          <Text style={styles.newCardDetailValue}>2 Tons</Text>
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
            <Text style={styles.posterName}>User {item.userId}</Text>
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" size={12} color="#FFD700" />
              ))}
            </View>
          </View>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="phone" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#6B7280' }]}
            >
              <Icon name="message-circle" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
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

  // Function to handle utility icon click
  const handleUtilityClick = (utility: UtilityIcon) => {
    setSelectedUtility(utility);
    setShowUtilityPopup(true);
  };

  // Function to handle View More button click
  const handleViewMore = () => {
    navigation.navigate('MarketPlace' as never);
  };

  // Function to handle banner click - navigate to AddPost
  const handleBannerPress = () => {
    navigation.navigate('MarketPlace' as never);
  };

  // Function to render truck card
  const renderTruckCard = (item: MarketPlaceItem) => (
    <TouchableOpacity 
      key={item.id} 
      style={styles.newCard}
      onPress={() => toggleCardDetails(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.newCardHeader}>
        <View style={styles.newCardHeaderLeft}>
          <Text style={styles.newCardTitle}>Truck required</Text>
          <Text style={styles.newCardTime}>{getTimeAgo(item.createdAt)}</Text>
        </View>
        <View style={styles.truckCardIcon}>
          <Icon name="truck" size={20} color="#10B981" />
        </View>
      </View>

      <View style={styles.newCardRoute}>
        <Icon name="map-pin" size={14} color="#dc2626" />
        <Text style={styles.newCardRouteText}>
          {item.pickupLocation} → {item.dropLocation}
        </Text>
      </View>

      <View style={styles.newCardDivider} />

      <View style={styles.newCardDetails}>
        <View style={styles.newCardDetailItem}>
          <Text style={styles.newCardDetailLabel}>WHEN?</Text>
          <Text style={styles.newCardDetailValue}>
            {formatDate(item.availableFrom)}
          </Text>
        </View>
        <View style={styles.newCardDetailItem}>
          <Text style={styles.newCardDetailLabel}>MATERIAL</Text>
          <Text style={styles.newCardDetailValue}>Electronics</Text>
        </View>
        <View style={styles.newCardDetailItem}>
          <Text style={styles.newCardDetailLabel}>WEIGHT</Text>
          <Text style={styles.newCardDetailValue}>15 Tons</Text>
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
        <View style={styles.truckFooter}>
          <View style={styles.truckOwnerInfo}>
            <Text style={styles.truckOwnerName}>Owner {item.userId}</Text>
            <View style={styles.truckRatingContainer}>
              {[...Array(5)].map((_, i) => (
                <Icon key={i} name="star" size={12} color="#FFD700" />
              ))}
            </View>
          </View>
          <View style={styles.truckActionButtons}>
            <TouchableOpacity style={styles.truckActionButton}>
              <Icon name="phone" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.truckActionButton, { backgroundColor: '#6B7280' }]}
            >
              <Icon name="message-circle" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#fff" />
      <LinearGradient
        colors={['#6B46C1', '#FFBEA8', '#F3F4F6']}
        locations={[0, 0.3, 0.5]}
        style={styles.gradientContainer}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <Text style={styles.locationText}>You are in</Text>
            <Text style={styles.locationName}>Avinashi Road, Coimbatore</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.walletContainer}>
              <Icon name="credit-card" size={16} color="#fff" />
              <Text style={styles.walletText}>0</Text>
            </View>
            <Icon name="bell" size={20} color="#fff" style={styles.bellIcon} />
          </View>
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Service Cards */}
          <View style={styles.serviceCardsContainer}>
            {serviceCards.map(card => (
              <View
                key={card.id}
                style={[
                  styles.serviceCard,
                  { backgroundColor: card.backgroundColor },
                ]}
              >
                <View style={styles.serviceCardHeader}>
                  <Text
                    style={[
                      styles.serviceBadge,
                      { backgroundColor: card.badgeColor },
                    ]}
                  >
                    {card.badge}
                  </Text>
                </View>
                <Text style={styles.serviceCardTitle}>{card.title}</Text>
                <TouchableOpacity style={styles.serviceCardButton}>
                  <Text style={styles.serviceCardButtonText}>
                    {card.buttonText}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Utility Icons */}
          <View style={styles.utilityIconsContainer}>
            {utilityIcons.map(utility => (
              <View key={utility.id} style={styles.utilityIcon}>
                <TouchableOpacity 
                  style={styles.utilityIconCircle}
                  onPress={() => handleUtilityClick(utility)}
                >
                  {/* <Icon name={utility.icon} size={24} color="#6B46C1" /> */}
                  {utility.icon}
                </TouchableOpacity>
                <Text style={styles.utilityIconLabel}>{utility.label}</Text>
              </View>
            ))}
          </View>

          {/* Recent Posts Section */}
          <View style={styles.recentPostsContainer}>
            <Text style={styles.recentPostsTitle}>Recent posts near you</Text>

            {/* Purple Banner */}
            <View style={styles.purpleBanner}>
              <TouchableOpacity
                style={styles.bannerContent}
                onPress={handleBannerPress}
              >
                <View style={[styles.bannerIcons,{right: 0, zIndex: 3}]}>
                  <FontAwesome6 name="truck" size={20} color="#3902A1" />
                </View>
                <View style={[styles.bannerIcons,{right: 15, zIndex: 2}]}>
                  <FontAwesome6 name="user-large" size={20} color="#3902A1" />
                </View>
                <View style={[styles.bannerIcons,{right: 25, zIndex: 1}]}>
                  <FontAwesome6 name="box" size={20} color="#3902A1" />
                </View>

                <Text style={styles.bannerText}>
                  Need a truck, driver, or load? Post in seconds.
                </Text>
                <Icon name="arrow-right" size={20} color="#3902A1" />
              </TouchableOpacity>
            </View>

            {/* Post Cards List */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading posts...</Text>
              </View>
            ) : marketplaceData.length > 0 ? (
              <>
                {marketplaceData
                  .slice(0, 6)
                  .map(item =>
                    item.itemTypeID === 1
                      ? renderLoadCard(item)
                      : renderTruckCard(item),
                  )}

                {/* View More Button */}
                {marketplaceData.length > 6 && (
                  <TouchableOpacity
                    style={styles.viewMoreButton}
                    onPress={handleViewMore}
                  >
                    <Text style={styles.viewMoreText}>View More</Text>
                    <Icon name="arrow-right" size={16} color="#6B46C1" />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No posts available</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>

      {/* Utility Popup Modal */}
      <Modal
        visible={showUtilityPopup}
        transparent={false}
        animationType="slide"
        onRequestClose={() => setShowUtilityPopup(false)}
      >
        <View style={styles.fullScreenModal}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.modalIconContainer}>
              {selectedUtility?.icon}
            </View>
            <Text style={styles.modalTitle}>{selectedUtility?.label}</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowUtilityPopup(false)}
            >
              <Icon name="x" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Modal Content - Render appropriate component */}
          <View style={styles.modalContent}>
            {selectedUtility?.id === '1' && <MileageCalculator />}
            {selectedUtility?.id === '2' && <TollCalculator />}
            {selectedUtility?.id === '3' && <TripAccounts />}
            {selectedUtility?.id === '4' && <PrimePetrolBunks />}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6B46C1',
  },
  gradientContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTop: {
    marginBottom: 15,
  },
  timeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 15,
  },
  walletText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  bellIcon: {
    marginLeft: 5,
  },
  locationContainer: {
    marginTop: 5,
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  locationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  serviceCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  serviceCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceCardHeader: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  serviceBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  serviceCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
  },
  serviceCardButton: {
    backgroundColor: '#1E40AF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  serviceCardButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  utilityIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  utilityIcon: {
    alignItems: 'center',
    flex: 1,
  },
  utilityIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  utilityIconLabel: {
    fontSize: 11,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  recentPostsContainer: {
    marginBottom: 20,
  },
  recentPostsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 15,
  },
  purpleBanner: {
    backgroundColor: '#F5F0FF',
    borderWidth: 1,
    borderColor: '#3902A1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerIcons: {
    flexDirection: 'row',
    padding: 10,
    gap: 8,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerText: {
    flex: 1,
    color: '#3902A1',
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  postCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // borderLeftWidth: 4,
    // borderLeftColor: '#6B46C1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  postTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  postTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  postRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  postRouteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  postDetails: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#DEDEDE',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    gap: 10,
  },
  postDetailItem: {
    marginBottom: 8,
  },
  postDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  postDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
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
  ratingContainer: {
    flexDirection: 'row',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  // Truck Card Styles
  truckCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  truckHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  truckHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  truckTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  truckTime: {
    fontSize: 12,
    color: '#6B7280',
  },
  truckRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  truckRouteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 6,
  },
  truckDetails: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: '#DEDEDE',
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    gap: 10,
  },
  truckDetailItem: {
    marginBottom: 8,
  },
  truckDetailLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  truckDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  truckFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  truckOwnerInfo: {
    flex: 1,
  },
  truckOwnerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  truckRatingContainer: {
    flexDirection: 'row',
  },
  truckActionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  truckActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // View More Button Styles
  viewMoreButton: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6B46C1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B46C1',
    marginRight: 8,
  },
  // Details Button Styles
  detailsButton: {
    backgroundColor: '#F5F0FF',
    borderWidth: 1,
    borderColor: '#6B46C1',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B46C1',
    marginRight: 8,
  },
  // New Card Styles
  newCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
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
    color: '#000',
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
  newCardRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  newCardRouteText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
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
    color: '#000',
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
    color: '#000',
  },
  // Load Card with Yellow Theme
  // loadCard: {
  //   backgroundColor: '#FFFBEB',
  //   borderRadius: 12,
  //   padding: 16,
  //   marginBottom: 16,
  //   borderWidth: 2,
  //   borderColor: '#F59E0B',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // // Truck Card with Green Theme
  // truckCardNew: {
  //   backgroundColor: '#F0FDF4',
  //   borderRadius: 12,
  //   padding: 16,
  //   marginBottom: 16,
  //   borderWidth: 2,
  //   borderColor: '#10B981',
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  // Truck Card Icon with Green Theme
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

  // Utility Popup Modal Styles
  fullScreenModal: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
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
  modalContent: {
    flex: 1,
  },
});
