// LoginScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useNavigation } from "@react-navigation/native";
import { checkMobile, loginWithOtp } from "../services/login";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import color from "../components/color";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, setLoading, setError, clearError } from "../store/slice/user";

const CELL_COUNT = 6;

export default function Login() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { isLoading, error } = useAppSelector((state) => state.user);
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  // Clear error when component mounts
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      Alert.alert("Error", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const sendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number (at least 10 digits)");
      return;
    }

    try {
      // First check if mobile exists
      const response = await checkMobile(phone);
      
      if (response.exists) {
        // Mobile exists, proceed with OTP
        console.log("Mobile exists, sending OTP to", phone);
        setIsOtpSent(true);
      } else {
        // Mobile doesn't exist, navigate to register
        navigation.navigate("Register" as never)
      }
    } catch (error) {
      console.error("Error checking mobile:", error);
      Alert.alert("Error", "Failed to verify phone number. Please try again.");
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== CELL_COUNT) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    dispatch(setLoading(true));

    try {
      // Call your login API here
      const loginData = {
        mobileNumber: phone,
        otp: otp,
        deviceType: Platform.OS,
        deviceToken: "mock-device-token", // Replace with actual device token
        loginType: "otp"
      };

      // const response = await loginWithOtp(loginData);
      
      // Save user data to Redux store
      dispatch(setUser({
        user: {
          id: "1",
        firstName: "John",
        lastName: "Doe",
        userName: "john.doe",
        userCode: "1234567890",
        mobileNumber: "1234567890",
        email: "john.doe@example.com",
        city: "New York",
        pincode: "10001",
        state: "New York",
        address: "123 Main St",
        gender: "male",
        photo: "https://via.placeholder.com/150",
        dateOfBirth: "2000-01-01",
        adharCardNumber: "1234567890",
        organizationID: 1,
        roleID: 1,
        token: "mock-token",
        refreshToken: "mock-refresh-token"
        },
        token: "mock-token",
        refreshToken: "mock-refresh-token"
      }));
      
    } catch (error) {
      console.error("Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header Branding */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Feather name="truck" size={30} color="#fff" />
          </View>
          <Text style={styles.brandName}>Truck Message</Text>
          <Text style={styles.tagline}>Your Complete Logistics Partner</Text>
        </View>
      </View>

      {/* Login Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        {!isOtpSent ? (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number or Email</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📱</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter phone number or email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.signInButton, isLoading && styles.buttonDisabled]} 
              onPress={sendOtp}
              disabled={isLoading}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
              <FontAwesome6 name="arrow-right" size={14} color="#fff"/>
            </TouchableOpacity>

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            <View style={styles.separator} />

            <Text style={styles.createAccountText}>New to Truck Message?</Text>
            <TouchableOpacity 
              style={styles.createAccountButton}
              onPress={() => navigation.navigate("Register" as never)}
            >
              <Text style={styles.createAccountButtonText}>Create Account</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Enter OTP</Text>
              <CodeField
                ref={ref}
                {...props}
                value={otp}
                onChangeText={setOtp}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                renderCell={({ index, symbol, isFocused }) => (
                  <Text
                    key={index}
                    style={[styles.cell, isFocused && styles.focusCell]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    {symbol || (isFocused ? <Cursor /> : null)}
                  </Text>
                )}
              />
            </View>
            
            <TouchableOpacity style={styles.signInButton} onPress={verifyOtp}>
              <Text style={styles.signInButtonText}>Verify OTP</Text>
              <FontAwesome6 name="arrow-right" size={14} color="#fff"/>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        By continuing, you agree to our Terms of Service and Privacy Policy
      </Text>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.backgroundLight,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 140,
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
  logoText: {
    fontSize: 32,
  },
  brandName: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 1,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 12,
    color: "#6B7280",
  },
  input: {
    flex: 1,
    height: 30,
    fontSize: 12,
    color: "#111827",
  },
  signInButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  arrowIcon: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "center",
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginBottom: 24,
  },
  createAccountText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16,
    textAlign: "center",
  },
  createAccountButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  createAccountButtonText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  codeFieldRoot: {
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cell: {
    width: 48,
    height: 56,
    lineHeight: 56,
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    textAlign: "center",
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    color: "#111827",
  },
  focusCell: {
    borderColor: "#000",
    backgroundColor: "#fff",
  },
  footerText: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 32,
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
});
