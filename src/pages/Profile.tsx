import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import LinearGradient from 'react-native-linear-gradient';
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  clearUser,
} from "../store/slice/user";
import { useNavigation } from "@react-navigation/native";
import { hexToRgba } from "../components/colors";

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const user = useAppSelector(state => state.user.user);
  const isAuthenticated = useAppSelector(state => state.user.isAuthenticated);

  console.log(user);

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

      <ScrollView showsVerticalScrollIndicator={false}>
            <LinearGradient
      colors={['#3802E8', '#B978C2','#FFB578']}
      // start={{x: 0, y: 0}}
      // end={{x: 1, y: 1}}
      style={styles.container}
    >
        {/* Gradient Header */}
        <View style={styles.gradientHeader}>
        {/* Profile Picture */}
        <View style={styles.profilePictureContainer}>
          <View style={styles.profilePicture}>
            <Icon name="user" size={40} color="#8B5CF6" />
          </View>
        </View>

        {/* User Name */}
        <Text style={styles.userName}>
          {user.firstName} {user.lastName}
        </Text>

        {/* Follower/Following Count */}
        <Text style={styles.followerCount}>100 followers • 2 following</Text>

        {/* Rating Badge */}
        <View style={styles.ratingBadge}>
          <Text style={styles.ratingText}>4.5 stars</Text>
        </View>
        </View>
        </LinearGradient>

      <View style={styles.contentContainer} >
      {/* Statistics Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>100</Text>
          <Text style={styles.statLabel}>Connects</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>67</Text>
          <Text style={styles.statLabel}>Calls</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>83</Text>
          <Text style={styles.statLabel}>Messages</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>36</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
      </View>
      
      {/* Rewards Section */}
      <View style={styles.rewardsCard}>
        <View style={styles.rewardsIcon}>
          <Icon name="truck" size={24} color="#fff" />
        </View>
        <View style={styles.rewardsContent}>
          <Text style={styles.rewardsTitle}>Refer a user to earn rewards</Text>
          <Text style={styles.rewardsSubtitle}>Use rewards to make in-app purchases</Text>
        </View>
        <Icon name="chevron-right" size={20} color="#8B5CF6" />
      </View>

      {/* Account Section */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>My wallet (0.00 INR available)</Text>
            <Text style={styles.walletAmount}>0.00 INR available</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        
        <View style={styles.separator} />
        
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>Account statement</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        
        <View style={styles.separator} />
        
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>My Bookings</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Personal Information Section */}
      <Text style={styles.sectionTitle}>Personal information</Text>
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>Edit Profile</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>My Vehicles</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Settings Section */}
      <Text style={styles.sectionTitle}>Personal information</Text>
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate("Appearance" as never)}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>Appearance</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>Notification settings</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>Account Settings</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>App permissions</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* Personal Information Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>Send feedback</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>


      {/* Personal Information Section */}
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>User ID - {user.userID}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.listItem}>
          <View style={styles.listTextBox}>
            <Text style={styles.listTitle}>Member since - {new Date(user.createdAt).toLocaleDateString("en-GB")}</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
      </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Gradient Header
  gradientHeader: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  profilePictureContainer: {
    marginBottom: 16,
  },
  profilePicture: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  userName: { 
    fontSize: 24, 
    fontWeight: "700", 
    color: "#fff",
    marginBottom: 8,
  },
  followerCount: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 12,
    opacity: 0.9,
  },
  ratingBadge: {
    backgroundColor: "#fbbf24",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
  },

  // Statistics Cards
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 4,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: { 
    fontSize: 20, 
    fontWeight: "700", 
    color: "#8B5CF6",
    marginBottom: 4,
  },
  statLabel: { 
    fontSize: 12, 
    color: "#6b7280",
    textAlign: "center",
  },

  // Rewards Section
  rewardsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8B5CF6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rewardsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#8B5CF6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rewardsContent: {
    flex: 1,
  },
  rewardsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B5CF6",
    marginBottom: 4,
  },
  rewardsSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },

  // Section Title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
    color: "#000",
  },

  // Section Container
  sectionContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // List Items
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  listTextBox: { 
    flex: 1,
  },
  listTitle: { 
    fontSize: 16, 
    fontWeight: "500", 
    color: "#000",
  },
  walletAmount: {
    fontSize: 14,
    color: "#dc2626",
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginLeft: 16,
  },

  // Logout Button
  logoutButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#dc2626",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: { 
    color: "#dc2626", 
    fontSize: 16, 
    fontWeight: "600" 
  },

  // Error States
  errorText: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: "#3902A1",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  loginButtonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "600" 
  },
});
