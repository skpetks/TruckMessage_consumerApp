// src/screens/OpportunitiesScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { hexToRgba } from "../components/color";
import { getLoadAvailabilities } from "../services/loadAvalibility";
import { LoadAvailabilityType } from "../types/LoadAvailability";
import { useNavigation } from "@react-navigation/native";

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
  { id: "1", label: "All", icon: "apps" },
  { id: "2", label: "Load", icon: "package" },
  { id: "3", label: "Truck", icon: "truck" },
  { id: "4", label: "Driver", icon: "user" },
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
    year: 'numeric'
  });
};

const MarketPlace: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'needs' | 'buysell'>('needs');
  const [loadData, setLoadData] = useState<LoadAvailabilityType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLoadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getLoadAvailabilities();
        console.log('Load data:', data);
        setLoadData(data);
      } catch (err) {
        console.error('Error fetching load data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLoadData();
  }, []);

  return (
    <>
    <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
            <Icon name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
      <Text style={styles.headerTitle}>Marketplace</Text>
    </View>
    
    {/* Segmented Control */}
    <View style={styles.segmentedContainer}>
      <TouchableOpacity 
        style={[styles.segmentButton, selectedTab === 'needs' && styles.segmentButtonActive]}
        onPress={() => setSelectedTab('needs')}
      >
        <Icon name="clipboard" size={16} color={selectedTab === 'needs' ? '#2563eb' : '#000'} />
        <Text style={[styles.segmentText, selectedTab === 'needs' && styles.segmentTextActive]}>
          Needs
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.segmentButton, selectedTab === 'buysell' && styles.segmentButtonActive]}
        onPress={() => setSelectedTab('buysell')}
      >
        <Icon name="tag" size={16} color={selectedTab === 'buysell' ? '#2563eb' : '#000'} />
        <Text style={[styles.segmentText, selectedTab === 'buysell' && styles.segmentTextActive]}>
          Buy/Sell
        </Text>
      </TouchableOpacity>
    </View>
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Icon name="search" size={18} color="#666" />
        <TextInput
          placeholder="Search by location, route..."
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filters}>
        {filters.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={[
              styles.chip,
              chip.label === "All" && styles.chipActive,
            ]}
          >
            <Icon
              name={chip.icon}
              size={14}
              color={chip.label === "All" ? "#fff" : "#444"}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.chipText,
                chip.label === "All" && styles.chipTextActive,
              ]}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Filter Icon */}
        <TouchableOpacity style={styles.chip}>
          <Icon name="filter" size={14} color="#444" />
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
              setError(null);
              setLoading(true);
              // Re-fetch data
              getLoadAvailabilities()
                .then((data: LoadAvailabilityType[]) => {
                  setLoadData(data);
                  setLoading(false);
                })
                .catch((err: any) => {
                  setError('Failed to load data. Please try again.');
                  setLoading(false);
                });
            }}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Load Availability Cards */}
      {!loading && !error && loadData && Array.isArray(loadData) && loadData.length > 0 && loadData.map((item) => {
        // Add null checks for date fields
        const availableFrom = item.availableFrom ? new Date(item.availableFrom) : new Date();
        const availableTo = item.availableTo ? new Date(item.availableTo) : new Date();
        const timeAgo = getTimeAgo(availableFrom);
        
        return (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badgeRow}>
                <Text style={styles.badgeGray}>Load Available</Text>
                {item.cancel && <Text style={styles.badgeUrgent}>⚠️ Cancelled</Text>}
              </View>
              <Text style={styles.rating}>⭐ 4.5</Text>
            </View>

            {/* Title Row with Icon */}
            <View style={styles.titleRow}>
              <Icon
                name="package"
                size={16}
                color="#2563eb"
                style={{ marginRight: 6, backgroundColor: hexToRgba("#2563eb", 0.1), borderRadius: 6, padding: 4}}
              />
              <Text style={styles.title}>
                {item.pickupLocation || 'N/A'} → {item.dropLocation || 'N/A'}
              </Text>
            </View>

            {/* Details */}
            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>PICKUP</Text>
                <Text style={styles.detailValue}>{item.pickupLocation || 'N/A'}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>DROP</Text>
                <Text style={styles.detailValue}>{item.dropLocation || 'N/A'}</Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>AVAILABLE FROM</Text>
                <Text style={styles.detailValue}>{formatDate(availableFrom)}</Text>
              </View>
              <View style={styles.detailBox}>
                <Text style={styles.detailLabel}>AVAILABLE TO</Text>
                <Text style={styles.detailValue}>{formatDate(availableTo)}</Text>
              </View>
            </View>

            {/* Bottom Row */}
            <View style={styles.bottomRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.company}>
                  Posted {timeAgo}
                </Text>
              </View>
            
              {/* Call Button */}
              <TouchableOpacity style={styles.callBtn}>
                <Icon name="phone" size={16} color="#fff" />
                <Text style={styles.callBtnText}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* No Data Message */}
      {!loading && !error && loadData && Array.isArray(loadData) && loadData.length === 0 && (
        <View style={styles.noDataContainer}>
          <Icon name="package" size={48} color="#ccc" />
          <Text style={styles.noDataText}>No load availability found</Text>
          <Text style={styles.noDataSubtext}>Check back later for new opportunities</Text>
        </View>
      )}
    </ScrollView>
    
    {/* Floating Add Button */}
    <TouchableOpacity 
      style={styles.floatingButton}
      onPress={() => {
        // Handle add new post action
        console.log('Add new post pressed');
        navigation.navigate('Post' as never);
      }}
    >
      <Icon name="plus" size={24} color="#fff" />
    </TouchableOpacity>
    </>
  );
};

export default MarketPlace;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16, },

  // Search Bar
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },
  searchInput: { marginLeft: 8, flex: 1, fontSize: 14, color: "#000" },

  // Chips
  filters: { flexDirection: "row", flexWrap: "wrap", marginBottom: 12 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#000" },
  chipText: { fontSize: 13, color: "#333" },
  chipTextActive: { color: "#fff", fontWeight: "600" },

  // Cards
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between" },
  badgeRow: { flexDirection: "row", gap: 6 },
  badgeGray: {
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    color: "#444",
  },
  badgeUrgent: {
    backgroundColor: "#fee2e2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 12,
    color: "#dc2626",
    fontWeight: "600",
  },
  rating: { fontSize: 14, color: "#444" },

  // Title
  titleRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  title: { fontSize: 14, fontWeight: "600", color: "#000", },

  // Details
  detailsRow: { flexDirection: "row"},
  detailBox: {
    backgroundColor: "#f9fafb",
    padding: 8,
    flex: 1,
  },
  detailLabel: { fontSize: 12, color: "#666" },
  detailValue: { fontSize: 14, fontWeight: "600", color: "#000" },

  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },


  // Price
  price: { fontSize: 16, fontWeight: "700", color: "#16a34a", marginBottom: 4 },
  company: { fontSize: 12, color: "#666", marginBottom: 10 },

  // Button
  callBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  callBtnText: { color: "#fff", fontSize: 14, fontWeight: "600", marginLeft: 6 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#000" },
  backButton: {
    padding: 6,
  },
  
  // Segmented Control
  segmentedContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  segmentButtonActive: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: "#2563eb",
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginLeft: 6,
  },
  segmentTextActive: {
    color: "#2563eb",
  },
  
  // Floating Button
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 46,
    height: 46,
    borderRadius: 28,
    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
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
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#dc2626",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  
  // No Data State
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
    textAlign: "center",
  },
  noDataSubtext: {
    fontSize: 14,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
});
