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
} from "react-native";
import { registerUser } from "../services/register";
import { useNavigation } from "@react-navigation/native";

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
      navigation.navigate('Home')
    } catch (err: any) {
      Alert.alert("Error", err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      {Object.keys(form).map((field) => (
        <TextInput
          key={field}
          style={styles.input}
          placeholder={field}
          value={form[field as keyof typeof form]}
          onChangeText={(text) => handleChange(field, text)}
        />
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Register</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
