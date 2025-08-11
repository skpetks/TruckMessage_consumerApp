// LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { useNavigation } from "@react-navigation/native";
import { checkMobile } from "../services/Login";

const CELL_COUNT = 6;

export default function Login() {
  const navigation = useNavigation();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });

  const sendOtp = async () => {
    if (phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number (at least 10 digits)");
      return;
    }

    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = () => {
    console.log("Verifying OTP", otp);
    Alert.alert(`Logged in with phone: ${phone}`);
    navigation.navigate("Home" as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome 👋</Text>
        <Text style={styles.subtitle}>Login with your phone number</Text>

        {!isOtpSent ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Enter phone number"
              placeholderTextColor="#aaa"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={sendOtp}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? "Checking..." : "Send OTP"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
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
            <TouchableOpacity style={styles.button} onPress={verifyOtp}>
              <Text style={styles.buttonText}>Verify OTP</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  codeFieldRoot: {
    marginTop: 20,
    marginBottom: 20,
  },
  cell: {
    width: 45,
    height: 55,
    lineHeight: 55,
    fontSize: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlign: "center",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
  },
  focusCell: {
    borderColor: "#4A90E2",
  },
});
