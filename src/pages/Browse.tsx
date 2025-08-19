// src/screens/OpportunitiesScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { hexToRgba } from "../components/color";
import CustomHeader from "../components/CustomHeader";

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

const opportunities: Opportunity[] = [
  {
    id: "1",
    type: "Truck Available",
    rating: 4.7,
    title: "Tata LPT 1618",
    details: [
      { label: "CAPACITY", value: "16 Tons" },
      { label: "LOCATION", value: "Coimbatore" },
    ],
    price: "₹16/km",
    company: "Raj Transport",
    timeAgo: "1 hour ago",
    icon: "truck",
    iconColor: "#22c55e",
  },
  {
    id: "2",
    type: "Full Load",
    urgent: true,
    rating: 4.5,
    title: "Coimbatore → Chennai",
    details: [
      { label: "WEIGHT", value: "15 Tons" },
      { label: "MATERIAL", value: "Electronics" },
    ],
    price: "₹25,000",
    company: "Transport Co.",
    timeAgo: "2 hours ago",
    icon: "send",
    iconColor: "#2563eb",
  },
  {
    id: "3",
    type: "Driver Available",
    rating: 4.6,
    title: "Ramesh Kumar",
    details: [
      { label: "EXPERIENCE", value: "8 Years" },
      { label: "LOCATION", value: "Coimbatore" },
    ],
    price: "",
    company: "",
    timeAgo: "",
    icon: "user",
    iconColor: "#9333ea",
  },
];

const OpportunitiesScreen: React.FC = () => {
  return (
    <>
    <CustomHeader userName="John Doe" location="Coimbatore" />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 🔍 Search Bar */}
      <View style={styles.searchBar}>
        <Icon name="search" size={18} color="#666" />
        <TextInput
          placeholder="Search by location, route..."
          style={styles.searchInput}
          placeholderTextColor="#888"
        />
      </View>

      {/* 🟢 Filter Chips */}
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

      {/* 🟡 Opportunity Cards */}
      {opportunities.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeGray}>{item.type}</Text>
              {item.urgent && <Text style={styles.badgeUrgent}>🔥 Urgent</Text>}
            </View>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>

          {/* Title Row with Icon */}
          <View style={styles.titleRow}>
            <Icon
              name={item.icon}
              size={16}
              color={item.iconColor}
              style={{ marginRight: 6 , backgroundColor: hexToRgba(item.iconColor, 0.1), borderRadius: 6, padding: 4}}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>

          {/* Details */}
          <View style={styles.detailsRow}>
            {item.details.map((d, i) => (
              <View key={i} style={styles.detailBox}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}
          </View>

        {/* Price + Company + Call Button */}
          <View style={styles.bottomRow}>
            {/* Left side: Price & Company */}
            <View style={{ flex: 1 }}>
              {item.price ? <Text style={styles.price}>{item.price}</Text> : null}
              {item.company ? (
                <Text style={styles.company}>
                  {item.company} • {item.timeAgo}
                </Text>
              ) : null}
            </View>
          
            {/* Right side: Call Button */}
            <TouchableOpacity style={styles.callBtn}>
              <Icon name="phone" size={16} color="#fff" />
              <Text style={styles.callBtnText}>Call Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
    </>
  );
};

export default OpportunitiesScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },

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
  detailsRow: { flexDirection: "row", marginBottom: 8 },
  detailBox: {
    backgroundColor: "#f9fafb",
    padding: 8,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
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
});
