import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { registerUser } from "../services/register";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Feather';
import color from "../components/color";

export default function RegisterScreen() {
  const navigation = useNavigation()
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    userCode: "08-",
    password: "",
    mobileNumber: "",
    email: "",
    city: "",
    pincode: "",
    state: "",
    address: "",
    gender: "",
    photo: "",
    dateOfBirth: "",
    adharCardNumber: "",
    organizationID: "1",
  });

  const [userType, setUserType] = useState("truckOwner");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!form.firstName || !form.mobileNumber || !form.password) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        organizationID: Number(form.organizationID),
        deviceType: "",
        deviceToken: "",
        googleToken: "string",
        loginType: "string",
        roleID: 1,
      };

      const response = await registerUser(payload);
      console.log(response);
      navigation.navigate('BottomTabNavigation' as never)
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    {
      id: "truckOwner",
      title: "Truck Owner",
      description: "Own and manage trucks for logistics",
      icon: "truck",
      selected: userType === "truckOwner"
    },
    {
      id: "driver",
      title: "Driver",
      description: "Professional driver looking for opportunities",
      icon: "user",
      selected: userType === "driver"
    },
    {
      id: "transportAgent",
      title: "Transport Agent",
      description: "Logistics coordinator and broker",
      icon: "building",
      selected: userType === "transportAgent"
    }
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Branding */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logo}>
              <Icon name="truck" size={30} color="#fff" />
            </View>
            <Text style={styles.brandName}>Join Truck Message</Text>
            <Text style={styles.tagline}>Connect with India's logistics network</Text>
          </View>
        </View>

        {/* Registration Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Create Your Account</Text>

          {/* User Type Selection */}
          <View style={styles.userTypeSection}>
            <Text style={styles.sectionLabel}>I am a</Text>
            {userTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.userTypeOption,
                  type.selected && styles.userTypeOptionSelected
                ]}
                onPress={() => setUserType(type.id)}
              >
                <View style={styles.userTypeLeft}>
                  <Icon 
                    name={type.icon as any} 
                    size={20} 
                    color={type.selected ? "#000" : "#6B7280"} 
                  />
                  <View style={styles.userTypeText}>
                    <Text style={[
                      styles.userTypeTitle,
                      type.selected && styles.userTypeTitleSelected
                    ]}>
                      {type.title}
                    </Text>
                    <Text style={styles.userTypeDescription}>
                      {type.description}
                    </Text>
                  </View>
                </View>
                <View style={[
                  styles.radioButton,
                  type.selected && styles.radioButtonSelected
                ]}>
                  {type.selected && <View style={styles.radioButtonInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input Fields */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your full name"
                placeholderTextColor="#9CA3AF"
                value={`${form.firstName} ${form.lastName}`.trim()}
                onChangeText={(text) => {
                  const names = text.split(' ');
                  handleChange("firstName", names[0] || "");
                  handleChange("lastName", names.slice(1).join(' ') || "");
                }}
              />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Icon name="phone" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number"
                  placeholderTextColor="#9CA3AF"
                  value={form.mobileNumber}
                  onChangeText={(text) => handleChange("mobileNumber", text)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email (Optional)</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail" size={18} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter email address"
                  placeholderTextColor="#9CA3AF"
                  value={form.email}
                  onChangeText={(text) => handleChange("email", text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>City</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Select your city"
                  placeholderTextColor="#9CA3AF"
                  value={form.city}
                  onChangeText={(text) => handleChange("city", text)}
                />
                <Icon name="chevron-down" size={18} color="#6B7280" style={styles.inputIconRight} />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
                  placeholderTextColor="#9CA3AF"
                  value={form.password}
                  onChangeText={(text) => handleChange("password", text)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={18} 
                    color="#6B7280" 
                    style={styles.inputIconRight} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.createAccountButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.createAccountButtonText}>Create Account</Text>
                <Icon name="arrow-right" size={20} color="#fff" style={styles.arrowIcon} />
              </>
            )}
          </TouchableOpacity>

          {/* Sign In Section */}
          <View style={styles.signInSection}>
            <Text style={styles.signInText}>Already have an account?</Text>
            <TouchableOpacity 
              style={styles.signInButton}
              onPress={() => navigation.navigate("Login" as never)}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

//3.40 - 4.40, 6.40 - 7.30

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundLight,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
  },
  logo: {
    width: 60,
    height: 60,
    backgroundColor: "#000",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  tagline: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 32,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 24,
    textAlign: "center",
  },
  userTypeSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 16,
  },
  userTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  userTypeOptionSelected: {
    borderColor: "#000",
    backgroundColor: "#F9FAFB",
  },
  userTypeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  userTypeText: {
    marginLeft: 16,
    flex: 1,
  },
  userTypeTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
  },
  userTypeTitleSelected: {
    color: "#000",
  },
  userTypeDescription: {
    fontSize: 11,
    color: "#6B7280",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  radioButtonSelected: {
    borderColor: "#000",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#000",
  },
  inputSection: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 1,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputIconRight: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    // height: 48,
    fontSize: 12,
    color: "#111827",
  },
  createAccountButton: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  createAccountButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  arrowIcon: {
    marginLeft: 4,
  },
  signInSection: {
    alignItems: "center",
  },
  signInText: {
    fontSize: 16,
    color: "#111827",
    marginBottom: 16,
    textAlign: "center",
  },
  signInButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  signInButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 18,
  },
});
