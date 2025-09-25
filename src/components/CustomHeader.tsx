import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import color from "./colors";
import font from "./font";

interface Props {
  userName: string;
  location: string;
  onNotificationPress?: () => void;
  onLocationPress?: () => void;
}

const CustomHeader: React.FC<Props> = ({
  userName,
  location,
  onNotificationPress,
  onLocationPress,
}) => {
  return (
    <View style={styles.header}>
      {/* Left: Logo + Text */}
      <View style={styles.leftSection}>
        <View style={styles.logoContainer}>
          <Icon name="truck" size={20} color={color.textLight} />
        </View>
        <View>
          <Text style={styles.title}>Truck Message</Text>
          <Text style={styles.subtitle}>Welcome, {userName}</Text>
        </View>
      </View>

      {/* Right: Notification + Location */}
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={onNotificationPress} style={styles.iconBtn}>
          <Icon name="bell" size={20} color={color.textDark} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onLocationPress}
          style={styles.locationContainer}
        >
          <Icon name="map-pin" size={16} color={color.textDark} />
          <Text style={styles.locationText}>{location}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: color.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: color.borderLight,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoContainer: {
    backgroundColor: color.textDark,
    padding: 10,
    borderRadius: 12,
    marginRight: 10,
  },
  title: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    fontWeight: "700",
    color: color.textDark,
  },
  subtitle: {
    fontFamily: font.fontFamily,
    fontSize: 13,
    color: color.textLightGray,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    padding: 6,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: color.backgroundLightGray,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    marginLeft: 5,
    fontFamily: font.fontFamily,
    fontSize: 13,
    color: color.textDark,
    fontWeight: "500",
  },
});
