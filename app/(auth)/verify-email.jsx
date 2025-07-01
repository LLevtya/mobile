import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { COLORS } from "../../constants/colors";
import { authStyles } from "../../assets/styles/auth.styles";
import { useAuthStore } from "../../store/authStore";

export default function VerifyEmail() {
  const router = useRouter();
  const { email: paramEmail } = useLocalSearchParams();
  const [email, setEmail] = useState(paramEmail || "");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const { logout, user, setUser } = useAuthStore();

  const handleBackToSignUp = async () => {
    await logout();
    router.push("/(auth)/sign-up");
  };

  const handleVerify = async () => {
    if (!email || !code) {
      Alert.alert("Missing Info", "Please enter both email and code.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("https://yalm-app-project.onrender.com/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Verification failed");

      Alert.alert("Success", "Email verified successfully!");

      // Update user in store directly (set isVerified to true)
      if (user) {
        setUser({ ...user, isVerified: true });
      }

      router.replace("/(tabs)");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      Alert.alert("Missing Email", "Please enter your email first.");
      return;
    }

    setResending(true);
    try {
      const res = await fetch("https://yalm-app-project.onrender.com/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Could not resend code");

      Alert.alert("Code Sent", "Verification code resent to your email.");
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code we sent to your email address
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.textLight}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Verification Code"
        placeholderTextColor={COLORS.textLight}
        value={code}
        onChangeText={setCode}
        keyboardType="number-pad"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify Email</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer} onPress={handleResend}>
        <Text style={styles.linkText}>
          {resending ? "Resending..." : "Resend Verification Code"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style= {styles.linkContainer} onPress={handleBackToSignUp}>
        <Text style={authStyles.linkText}>
          Back to <Text style={authStyles.link}>Sign Up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4F46E5",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 18,
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  button: {
    backgroundColor: "#4F46E5",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  linkContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    fontSize: 15,
    color: "#4F46E5",
    fontWeight: "500",
  },
});
