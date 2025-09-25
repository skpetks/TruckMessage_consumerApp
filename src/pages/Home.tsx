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
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import MetrialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import LinearGradient from 'react-native-linear-gradient';
import CustomHeader from '../components/CustomHeader';
import color, { hexToRgba } from '../components/colors';
import font from '../components/font';
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
    badgeColor: color.badgeDanger,
    buttonText: 'Recharge now >',
    backgroundColor: color.backgroundWhite,
  },
  {
    id: '2',
    title: 'Insurance renewal',
    badge: '2 Due',
    badgeColor: color.badgeDanger,
    buttonText: 'Renew now >',
    backgroundColor: color.backgroundWhite,
  },
];

const utilityIcons: UtilityIcon[] = [
  {
    id: '1',
    icon: <MetrialIcons name="speed" size={24} color={color.iconPrimary} />,
    label: 'Mileage calculator',
  },
  {
    id: '2',
    icon: <MetrialIcons name="toll" size={24} color={color.iconPrimary} />,
    label: 'Toll calculator',
  },
  {
    id: '3',
    icon: <Icon name="file-text" size={24} color={color.iconPrimary} />,
    label: 'Trip accounts',
  },
  {
    id: '4',
    icon: <Icon name="droplet" size={24} color={color.iconPrimary} />,
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
          <Icon name="box" size={20} color={color.iconWarning} />
        </View>
      </View>

      <View style={styles.newCardRoute}>
        <Icon name="map-pin" size={14} color={color.iconDanger} />
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
          <Icon name="truck" size={20} color={color.iconSuccess} />
        </View>
      </View>

      <View style={styles.newCardRoute}>
        <Icon name="map-pin" size={14} color={color.iconDanger} />
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
                <Icon key={i} name="star" size={12} color={color.rating} />
              ))}
            </View>
          </View>
          <View style={styles.truckActionButtons}>
            <TouchableOpacity style={styles.truckActionButton}>
              <Icon name="phone" size={16} color={color.textLight} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.truckActionButton, { backgroundColor: color.buttonDisabled }]}
            >
              <Icon name="message-circle" size={16} color={color.textLight} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={color.backgroundWhite} />
      <LinearGradient
        colors={[color.primary, '#FFBEA8', color.backgroundLightGray]}
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
              <Icon name="credit-card" size={16} color={color.textLight} />
              <Text style={styles.walletText}>0</Text>
            </View>
            <Icon name="bell" size={20} color={color.textLight} style={styles.bellIcon} />
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
                  {/* <Icon name={utility.icon} size={24} color={color.iconPrimary} /> */}
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
                  <FontAwesome6 name="truck" size={20} color={color.iconSecondary} />
                </View>
                <View style={[styles.bannerIcons,{right: 15, zIndex: 2}]}>
                  <FontAwesome6 name="user-large" size={20} color={color.iconSecondary} />
                </View>
                <View style={[styles.bannerIcons,{right: 25, zIndex: 1}]}>
                  <FontAwesome6 name="box" size={20} color={color.iconSecondary} />
                </View>

                <Text style={styles.bannerText}>
                  Need a truck, driver, or load? Post in seconds.
                </Text>
                <Icon name="arrow-right" size={20} color={color.iconSecondary} />
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
                    <Icon name="arrow-right" size={16} color={color.iconPrimary} />
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

        {/* Utility Action Sheet Modal */}
        <Modal
          visible={showUtilityPopup}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowUtilityPopup(false)}
          statusBarTranslucent={true}
        >
          <View style={styles.actionSheetOverlay}>
            <TouchableOpacity 
              style={styles.actionSheetBackdrop}
              activeOpacity={1}
              onPress={() => setShowUtilityPopup(false)}
            />
            <View style={styles.actionSheetContainer}>
              {/* Action Sheet Header */}
              <View style={styles.actionSheetHeader}>
                <View style={styles.actionSheetHandle} />
                <View style={styles.actionSheetTitleContainer}>
                  <View style={styles.modalIconContainer}>
                    {selectedUtility?.icon}
                  </View>
                  <Text style={styles.modalTitle}>{selectedUtility?.label}</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowUtilityPopup(false)}
                  >
                    <Icon name="x" size={24} color={color.textLightGray} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Action Sheet Content - Render appropriate component */}
              <View style={styles.actionSheetContent}>
                {selectedUtility?.id === '1' && <MileageCalculator />}
                {selectedUtility?.id === '2' && <TollCalculator />}
                {selectedUtility?.id === '3' && <TripAccounts />}
                {selectedUtility?.id === '4' && <PrimePetrolBunks />}
              </View>
            </View>
          </View>
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.containerBg,
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        paddingTop: 0,
      },
    }),
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
    fontFamily: font.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: color.textLight,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: hexToRgba(color.textLight, 0.2),
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 15,
  },
  walletText: {
    fontFamily: font.fontFamily,
    color: color.textLight,
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
    fontFamily: font.fontFamily,
    fontSize: 14,
    color: hexToRgba(color.textLight, 0.8),
    marginBottom: 2,
  },
  locationName: {
    fontFamily: font.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    color: color.textLight,
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
    shadowColor: color.textDark,
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
    fontFamily: font.fontFamily,
    fontSize: 12,
    fontWeight: '600',
    color: color.textLight,
  },
  serviceCardTitle: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: color.textDark,
    marginBottom: 15,
  },
  serviceCardButton: {
    backgroundColor: color.serviceCardBg,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  serviceCardButtonText: {
    fontFamily: font.fontFamily,
    color: color.textLight,
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
    shadowColor: color.backgroundWhite,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  utilityIconLabel: {
    fontFamily: font.fontFamily,
    fontSize: 11,
    color: color.textDark,
    textAlign: 'center',
    fontWeight: '500',
  },
  recentPostsContainer: {
    marginBottom: 20,
  },
  recentPostsTitle: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    fontWeight: '700',
    color: color.textDark,
    marginBottom: 15,
  },
  purpleBanner: {
    backgroundColor: color.backgroundCard,
    borderWidth: 1,
    borderColor: color.primaryDark,
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
    shadowColor: color.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerText: {
    flex: 1,
    color: color.primaryDark,
    fontSize: 14,
    fontWeight: '500',
    marginHorizontal: 12,
  },
  postCard: {
    backgroundColor: color.backgroundWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    // borderLeftWidth: 4,
    // borderLeftColor: color.primary,
    shadowColor: color.shadow,
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
    fontFamily: font.fontFamily,
    fontSize: 16,
    fontWeight: '600',
    color: color.textPrimary,
  },
  postTime: {
    fontFamily: font.fontFamily,
    fontSize: 12,
    color: color.textSecondary,
  },
  postRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  postRouteText: {
    fontFamily: font.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: color.textPrimary,
    marginLeft: 6,
  },
  postDetails: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.borderLight,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    paddingVertical: 5,
    gap: 10,
  },
  postDetailItem: {
    marginBottom: 8,
  },
  postDetailLabel: {
    fontFamily: font.fontFamily,
    fontSize: 12,
    color: color.textSecondary,
    marginBottom: 2,
  },
  postDetailValue: {
    fontFamily: font.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: color.textPrimary,
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
    fontFamily: font.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: color.textPrimary,
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
    backgroundColor: color.buttonSuccess,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: color.backgroundWhite,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingText: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    color: color.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    backgroundColor: color.backgroundWhite,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: color.textSecondary,
    fontWeight: '500',
  },
  // Truck Card Styles
  truckCard: {
    backgroundColor: color.backgroundWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: color.shadow,
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
    color: color.textPrimary,
  },
  truckTime: {
    fontSize: 12,
    color: color.textSecondary,
  },
  truckRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  truckRouteText: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textPrimary,
    marginLeft: 6,
  },
  truckDetails: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: color.borderLight,
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
    color: color.textSecondary,
    marginBottom: 2,
  },
  truckDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textPrimary,
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
    color: color.textPrimary,
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
    backgroundColor: color.buttonSuccess,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // View More Button Styles
  viewMoreButton: {
    backgroundColor: color.backgroundWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: color.primary,
    shadowColor: color.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  viewMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: color.primary,
    marginRight: 8,
  },
  // Details Button Styles
  detailsButton: {
    backgroundColor: color.backgroundCard,
    borderWidth: 1,
    borderColor: color.primary,
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
    color: color.primary,
    marginRight: 8,
  },
  // New Card Styles
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
    color: color.textSecondary,
  },
  newCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: color.backgroundCard,
    borderWidth: 1,
    borderColor: color.warning,
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
    backgroundColor: color.border,
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
    color: color.textSecondary,
    marginBottom: 4,
    fontWeight: '500',
  },
  newCardDetailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: color.textDark,
  },
  newDetailsButton: {
    backgroundColor: color.backgroundCard,
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
    backgroundColor: color.backgroundCard,
    borderWidth: 1,
    borderColor: color.success,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Action Sheet Modal Styles
  actionSheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 0 : 0,
  },
  actionSheetBackdrop: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  actionSheetContainer: {
    backgroundColor: color.backgroundWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '100%',
    minHeight: '90%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  actionSheetHeader: {
    paddingTop: 12,
    paddingBottom: 8,
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: color.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  actionSheetTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: color.border,
  },
  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: color.backgroundLightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modalTitle: {
    flex: 1,
    fontSize: 20,
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
  actionSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
