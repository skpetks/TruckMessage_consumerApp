// src/screens/HomeScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import CustomHeader from "../components/CustomHeader";
import { hexToRgba } from "../components/color";

type Service = {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeColor: string;
  color: string;
};

type Opportunity = {
  id: string;
  type: string;
  urgent?: boolean;
  rating: number;
  route: string;
  details: { label: string; value: string }[];
  price: string;
  company: string;
  timeAgo: string;
  icon: string;
  iconColor: string;
};

const services: Service[] = [
  {
    id: "1",
    title: "FASTag Recharge",
    subtitle: "10 accounts • 5 need recharge",
    badge: "5 Low",
    badgeColor: "#dc2626",
    color: "#2563eb",
  },
  {
    id: "2",
    title: "Insurance",
    subtitle: "10 vehicles • 5 expiring",
    badge: "5 Expiring",
    badgeColor: "#f97316",
    color: "#16a34a",
  },
];

const opportunities: Opportunity[] = [
  {
    id: "1",
    type: "Full Load",
    urgent: true,
    rating: 4.5,
    route: "Coimbatore → Chennai",
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
    id: "2",
    type: "Truck Available",
    rating: 4.7,
    route: "Tata LPT 1618",
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
];

const filters = ["All", "Load", "Truck", "Driver"];

const HomeScreen: React.FC = () => {
  return (
    <>
    <CustomHeader userName="John Doe" location="Coimbatore" />
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Quick Services */}
      <Text style={styles.sectionTitle}>Quick Services</Text>
      <FlatList
        data={services}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.serviceCard, { backgroundColor: item.color }]}>
            <View style={styles.serviceHeader}>
              <Text style={[styles.serviceBadge, { backgroundColor: item.badgeColor }]}>
                {item.badge}
              </Text>
            </View>
            <Text style={styles.serviceTitle}>{item.title}</Text>
            <Text style={styles.serviceSubtitle}>{item.subtitle}</Text>
            <TouchableOpacity style={styles.serviceBtn}>
              <Text style={styles.serviceBtnText}>Manage</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Latest Opportunities */}
      <View style={styles.opportunitiesHeader}>
        <Text style={styles.sectionTitle}>Latest Opportunities</Text>
        <TouchableOpacity>
          <Text style={styles.viewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filters}>
        {filters.map((chip, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.chip, chip === "All" && styles.chipActive]}
          >
            <Text style={[styles.chipText, chip === "All" && styles.chipTextActive]}>
              {chip}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Opportunities List */}
      {opportunities.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeGray}>{item.type}</Text>
              {item.urgent && <Text style={styles.badgeUrgent}>🔥 Urgent</Text>}
            </View>
            <Text style={styles.rating}>⭐ {item.rating}</Text>
          </View>

          <View style={styles.routeRow}>
            <Icon
              name={item.icon}
              size={16}
              color={item.iconColor}
              style={{ marginRight: 6 , backgroundColor: hexToRgba(item.iconColor, 0.1), borderRadius: 6, padding: 4}}
            />
             <Text style={styles.route}>{item.route}</Text>
          </View>
         

          <View style={styles.detailsRow}>
            {item.details.map((d, i) => (
              <View key={i} style={styles.detailBox}>
                <Text style={styles.detailLabel}>{d.label}</Text>
                <Text style={styles.detailValue}>{d.value}</Text>
              </View>
            ))}
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.price}>{item.price}</Text>
            <Text style={styles.company}>
              {item.company} • {item.timeAgo}
            </Text>
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb", padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#000", marginBottom: 10 },
  serviceCard: {
    width: 180,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
  },
  serviceHeader: { flexDirection: "row", justifyContent: "flex-end" },
  serviceBadge: {
    color: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontSize: 12,
    fontWeight: "600",
  },
  serviceTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginTop: 10 },
  serviceSubtitle: { color: "#f0fdf4", fontSize: 12, marginBottom: 10 },
  serviceBtn: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
  },
  serviceBtnText: { fontWeight: "600", color: "#000" },
  opportunitiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  viewAll: { color: "#1d4ed8", fontSize: 14, fontWeight: "500" },
  filters: { flexDirection: "row", marginTop: 12 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
  },
  chipActive: { backgroundColor: "#000" },
  chipText: { fontSize: 13, color: "#333" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
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
  routeRow: { flexDirection: "row", alignItems: "center", marginVertical: 8 },
  route: {fontSize: 14, fontWeight: "600", marginVertical: 8, color: "#000"},
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
  price: { fontSize: 16, fontWeight: "700", color: "#16a34a", marginBottom: 4 },
  company: { fontSize: 12, color: "#666", marginBottom: 10 },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
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
