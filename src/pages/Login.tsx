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
import { checkMobile, loginWithOtp, sendOtp } from "../services/login";
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import color from "../components/colors";
import font from "../components/font";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, setLoading, setError, clearError } from "../store/slice/user";

const CELL_COUNT = 4;

export default function Login() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  
  // Redux state
  const { isLoading, error } = useAppSelector((state) => state.user);
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpResponse, setOtpResponse] = useState(null);

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

  const handleSendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number (at least 10 digits)");
      return;
    }

    try {
      // First check if mobile exists
      const response = await checkMobile(phone);
      
      if (response.exists) {
        // Mobile exists, proceed with OTP
        console.log("Mobile exists, sending OTP to", response);
        const otpResponse = await sendOtp(phone);
        console.log('otpResponse', otpResponse);
        if(otpResponse.otp){
          setIsOtpSent(true);
          setOtpResponse(otpResponse);
        }else{
          Alert.alert("Error", "Failed to send OTP. Please try again.");
        }
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
        // deviceType: Platform.OS,
        // deviceToken: "mock-device-token", // Replace with actual device token
        // loginType: "otp"
      };

      const response = await loginWithOtp(loginData);

      console.log('response', response);
      // Save user data to Redux store
      dispatch(setUser({
        user: {
        userID: response.user.userID, 
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        userName: response.user.userName,
        userCode: response.user.userCode,
        mobileNumber: response.user.mobileNumber,
        email: response.user.email,
        city: response.user.city,
        pincode: response.user.pincode,
        state: response.user.state,
        address: response.user.address,
        gender: response.user.gender,
        photo: response.user.photo,
        dateOfBirth: response.user.dateOfBirth,
        adharCardNumber: response.user.adharCardNumber,
        organizationID: response.user.organizationID,
        roleID: response.user.roleID,
        token: response.token,
        refreshToken: response.refreshToken,
        createdAt: response.user.createdAt
        },
        token: response.token,
        refreshToken: response.refreshToken
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
            <Feather name="truck" size={30} color={color.textLight} />
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
                  placeholderTextColor={color.textMuted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>
            
            <TouchableOpacity 
              style={[styles.signInButton, isLoading && styles.buttonDisabled]} 
              onPress={handleSendOtp}
              disabled={isLoading}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
              <FontAwesome6 name="arrow-right" size={14} color={color.textLight}/>
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
              <Text style={styles.otpLabel}>{otpResponse?.otp}</Text>
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
              <FontAwesome6 name="arrow-right" size={14} color={color.textLight}/>
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
    backgroundColor: color.textDark,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontFamily: font.fontFamily,
    fontSize: 32,
  },
  brandName: {
    fontFamily: font.fontFamily,
    fontSize: 28,
    fontWeight: "700",
    color: color.textDark,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    color: color.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: color.backgroundWhite,
    width: "100%",
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    shadowColor: color.shadow,
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontFamily: font.fontFamily,
    fontSize: 20,
    fontWeight: "700",
    color: color.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    color: color.textSecondary,
    marginBottom: 32,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 24,
  },
  inputLabel: {
    fontFamily: font.fontFamily,
    fontSize: 12,
    fontWeight: "500",
    color: color.textGray,
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.inputBackground,
    borderWidth: 1,
    borderColor: color.inputBorder,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 1,
  },
  inputIcon: {
    fontFamily: font.fontFamily,
    fontSize: 16,
    marginRight: 12,
    color: color.textSecondary,
  },
  input: {
    flex: 1,
    height: 38,
    fontFamily: font.fontFamily,
    fontSize: 12,
    color: color.textPrimary,
  },
  signInButton: {
    backgroundColor: color.textDark,
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
    backgroundColor: color.buttonDisabled,
  },
  signInButtonText: {
    fontFamily: font.fontFamily,
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginRight: 8,
  },
  arrowIcon: {
    fontFamily: font.fontFamily,
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  forgotPassword: {
    alignSelf: "center",
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontFamily: font.fontFamily,
    color: color.textSecondary,
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: color.border,
    marginBottom: 24,
  },
  createAccountText: {
    fontFamily: font.fontFamily,
    fontSize: 14,
    color: color.textSecondary,
    marginBottom: 16,
    textAlign: "center",
  },
  createAccountButton: {
    backgroundColor: color.backgroundWhite,
    borderWidth: 1,
    borderColor: color.inputBorder,
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  createAccountButtonText: {
    fontFamily: font.fontFamily,
    color: color.textPrimary,
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
    borderColor: color.inputBorder,
    textAlign: "center",
    borderRadius: 12,
    backgroundColor: color.inputBackground,
    color: color.textPrimary,
  },
  focusCell: {
    borderColor: color.textDark,
    backgroundColor: color.backgroundWhite,
  },
  footerText: {
    fontFamily: font.fontFamily,
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 32,
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  otpLabel: {
    fontFamily: font.fontFamily,
    fontSize: 12,
    color: color.textGray,
    marginBottom: 8,
    textAlign: "left",
    alignSelf: "flex-start",
  },
});
