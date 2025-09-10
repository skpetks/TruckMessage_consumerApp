import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearUser,
  selectUser,
  selectIsAuthenticated,
} from "../store/slice/user";
import { useNavigation } from "@react-navigation/native";
import { hexToRgba } from "../components/color";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const user = useAppSelector(selectUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          dispatch(clearUser());
        },
      },
    ]);
  };

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please login to view profile</Text>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate("Login" as never)}
        >
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="user" size={40} color="#fff" style={{ marginRight: 10, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 10, padding: 4 }} />
          <View>
            <Text style={styles.userName}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={styles.userRole}>Truck Owner</Text>
            <Text style={styles.userPhone}>{user.mobileNumber}</Text>
          </View>
          </View>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Active Loads</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>156</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickCard}>
          <Icon name="file-text" size={24} color="#4A6CF7" style={{ backgroundColor: hexToRgba("#4A6CF7", 0.1), borderRadius: 10, padding: 4 }} />
          <Text style={styles.quickTitle}>FASTag History</Text>
          <Text style={styles.quickSubtitle}>View transactions</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickCard}>
          <Icon name="shield" size={24} color="#27AE60" style={{ backgroundColor: hexToRgba("#27AE60", 0.1), borderRadius: 10, padding: 4 }} />
          <Text style={styles.quickTitle}>Insurance Docs</Text>
          <Text style={styles.quickSubtitle}>Download policies</Text>
        </TouchableOpacity>
      </View>

      {/* Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>
      <TouchableOpacity style={styles.listItem}>
        <Icon name="truck" size={20} color="#666" style={{ backgroundColor: hexToRgba("#666", 0.1), borderRadius: 10, padding: 4 }} />
        <View style={styles.listTextBox}>
          <Text style={styles.listTitle}>My Vehicles</Text>
          <Text style={styles.listSubtitle}>Manage 10 vehicles</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItem}>
        <Icon name="credit-card" size={20} color="#666" style={{ backgroundColor: hexToRgba("#666", 0.1), borderRadius: 10, padding: 4 }} />
        <View style={styles.listTextBox}>
          <Text style={styles.listTitle}>Transaction History</Text>
          <Text style={styles.listSubtitle}>View all payments</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItem}>
        <Icon name="settings" size={20} color="#666" style={{ backgroundColor: hexToRgba("#666", 0.1), borderRadius: 10, padding: 4 }} />
        <View style={styles.listTextBox}>
          <Text style={styles.listTitle}>Settings</Text>
          <Text style={styles.listSubtitle}>App preferences</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#999" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.listItem}>
        <Icon name="help-circle" size={20} color="#666" style={{ backgroundColor: hexToRgba("#666", 0.1), borderRadius: 10, padding: 4 }} />
        <View style={styles.listTextBox}>
          <Text style={styles.listTitle}>Help & Support</Text>
          <Text style={styles.listSubtitle}>Get assistance</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#999" />
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },

  headerCard: {
    backgroundColor: "#3B3B3B",
    borderRadius: 16,
    padding: 20,
    margin: 14,
  },
  userName: { fontSize: 16, fontWeight: "700", color: "#fff" },
  userRole: { fontSize: 12, color: "#ddd", marginTop: 2 },
  userPhone: { fontSize: 12, color: "#ddd", marginTop: 2 },
  editBtn: {
    backgroundColor: "rgba(255,255,255,0.2)", // glassy white
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)", // subtle border
  },
  editBtnText: {
    color: "#fff", // keep text white for contrast
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  statBox: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "700", color: "#fff" },
  statLabel: { fontSize: 12, color: "#ddd", marginTop: 4 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
  },
  quickCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    alignItems: "center",
  },
  quickTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
    color: "#333",
  },
  quickSubtitle: { fontSize: 12, color: "#666", marginTop: 2 },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  listTextBox: { flex: 1, marginLeft: 12 },
  listTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  listSubtitle: { fontSize: 13, color: "#666" },

  logoutButton: {
    // backgroundColor: "#ff4444",
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#DE3131",
  },
  logoutButtonText: { color: "#DE3131", fontSize: 16, fontWeight: "600" },

  errorText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  loginButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
