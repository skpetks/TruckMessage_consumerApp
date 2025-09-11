import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/Feather";

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
        if (route.name === "Browse") iconName = "list";
        if (route.name === "MarketPlace") iconName = "list";
        if (route.name === "Post") iconName = "plus-circle";
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
              size={18}
              color={isFocused ? "#fff" : "#333"}
            />
            <Text
              style={[
                styles.tabItemText,
                { color: isFocused ? "#fff" : "#333" },
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
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
    height: 65,
    paddingHorizontal: 10,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    marginHorizontal: 6,
    borderRadius: 30, // make pill effect
    // flexDirection: "row",
    gap: 6,
  },
  tabItemActive: {
    backgroundColor: "#000", // dark active background
    paddingHorizontal: 16, // extra width for pill
  },
  tabItemText: {
    fontSize: 11,
    fontWeight: "500",
  },
});
