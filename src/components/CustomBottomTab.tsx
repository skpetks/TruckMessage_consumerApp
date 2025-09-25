import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Feather";
import color, { hexToRgba } from "./colors";
import font from "./font";

const CustomBottomTab = ({ state, descriptors, navigation }: any) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Icons
        let iconName = "home";
        if (route.name === "MarketPlace") iconName = "shopping-bag";
        if (route.name === "Message") iconName = "message-circle";
        if (route.name === "Profile") iconName = "user";

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={[styles.tabItem, isFocused && styles.tabItemActive]}
            activeOpacity={0.7}
          >
            <Icon
              name={iconName}
              size={20}
              color={isFocused ? color.tabActive : color.tabInactive}
            />
            <Text
              style={[
                styles.tabItemText,
                { color: isFocused ? color.tabActive : color.tabInactive },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomBottomTab;

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: color.tabBackground,
    borderTopWidth: 1,
    borderColor: color.border,
    height: 70,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: color.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    gap: 4,
  },
  tabItemActive: {
    backgroundColor: hexToRgba(color.tabActive, 0.1),
  },
  tabItemText: {
    fontFamily: font.fontFamily,
    fontSize: 12,
    fontWeight: "500",
  },
});
