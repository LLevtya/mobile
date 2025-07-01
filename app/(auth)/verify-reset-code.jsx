import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS } from "../../constants/colors";

export default function VerifyResetCode() {
  const router = useRouter();
  const { email: paramEmail } = useLocalSearchParams();
  const [email, setEmail] = useState(paramEmail || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerifyCode = async () => {
  try {
    const res = await fetch(`https://yalm-app-project.onrender.com/api/auth/verify-reset-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    router.push({ pathname: "/(auth)/reset-password", params: { email, code } });
  } catch (err) {
    Alert.alert("Invalid Code", err.message);
  }
};


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Reset Code</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="6-digit Code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleVerifyCode} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verify Code</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding: 24, justifyContent: "center", backgroundColor: "#F9FAFB" },
  title: { fontSize: 28, fontWeight: "700", color: "#4F46E5", marginBottom: 20, textAlign: "center" },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 18,
    fontSize: 16,
    color: "#111827",
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});

