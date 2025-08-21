import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import CustomHeader from "../components/CustomHeader";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { PostStackParamList } from "../navigator/PostNavigator";

type RequirementCardProps = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
  screen: string;
};

const requirements: RequirementCardProps[] = [
  {
    id: "1",
    title: "Post Load Requirement",
    subtitle: "Need a truck to transport your goods?",
    icon: "box",
    bgColor: "#EAF2FF",
    screen: "PostLoad",
  },
  {
    id: "2",
    title: "Post Truck Availability",
    subtitle: "Have a truck available for transport?",
    icon: "truck",
    bgColor: "#EFFFF3",
    screen: "PostTruck",
  },
  {
    id: "3",
    title: "Post Driver Availability",
    subtitle: "Looking for driving opportunities?",
    icon: "user",
    bgColor: "#F9F2FF",
    screen: "PostDriver",
  },
];

const RequirementCard: React.FC<RequirementCardProps> = ({ title, subtitle, icon, bgColor, screen }) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      {/* Icon */}
      <View style={styles.iconWrapper}>
        <Icon name={icon} size={28} color="#000" />
      </View>

      {/* Title & Subtitle */}
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      {/* Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate(screen as never)}>
        <Icon name="plus" size={14} color="#fff" />
        <Text style={styles.buttonText}> Post Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const PostRequirementScreen = () => {
  return (
    <>
    <CustomHeader userName="John Doe" location="Coimbatore" />
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Post Your Requirement</Text>
      <Text style={styles.subHeader}>
        Connect with thousands of logistics partners
      </Text>

      {/* Cards */}
      <FlatList
        data={requirements}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <RequirementCard {...item} />}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
    </>
  );
};

export default PostRequirementScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    color: "#000",
  },
  subHeader: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
    color: "#555",
  },
  card: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
  },
  iconWrapper: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginVertical: 6,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
});
