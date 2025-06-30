import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/authStore";
import { COLORS } from "../../constants/colors";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const router = useRouter();

  const goToSignup = () => {
  router.push("/sign-up"); // ✅ this is correct if Step 1 is clean
};
  const { user } = useAuthStore();

  const handleVerify = async () => {
    if (!user?.email) return Alert.alert("Error", "Missing email");

    try {
      setLoading(true);
      const response = await fetch("https://yalm-app-project.onrender.com/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email, code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid code");

      Alert.alert("Success", "Your email has been verified!");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!user?.email) return;

    try {
      setResending(true);
      const response = await fetch("https://yalm-app-project.onrender.com/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to resend code");

      Alert.alert("Success", "Verification code sent to your email.");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Email Verification</Text>

      <Text style={styles.description}>
        Enter the 6-digit code sent to:
      </Text>
      <Text style={styles.email}>{user?.email}</Text>

      <TextInput
        style={styles.codeInput}
        placeholder="Enter code"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
        maxLength={6}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        onPress={handleVerify}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleResend}
        disabled={resending}
      >
        <Text style={styles.resendText}>
          {resending ? "Sending..." : "Resend Code"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer} onPress={goToSignup}>
  <Text style={styles.linkText}>
    Back to <Text style={styles.link}>Sign Up</Text>
  </Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 28,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 14,
    color: COLORS.primary,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  codeInput: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    elevation: 2,
  },
  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginBottom: 18,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
  resendButton: {
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  resendText: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  linkContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  linkText: {
    color: "#444",
    fontSize: 14,
  },
  link: {
    color: COLORS.primary,
    fontWeight: "600",
  },
});
