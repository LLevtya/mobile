import { useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Image } from "expo-image";

import { authStyles } from "../../assets/styles/auth.styles";
import { COLORS } from "../../constants/colors";

export default function GetStarted() {
  const router = useRouter();

  return (
    <View style={authStyles.containerMain}>
      <Image
        source={require("../../assets/images/main.png")}
        style={authStyles.backgroundImage}
        contentFit="cover"
        transition={200}
      />

      <View style={authStyles.buttonContainer}>
        <TouchableOpacity
          style={[authStyles.authButtonMain]}
          onPress={() => router.push("/(auth)/start-imgs")}
        >
          <Text style={authStyles.buttonText}>Get Started</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[authStyles.authButtonMain]}
          onPress={() => router.push("/(auth)/sign-in")}
        >
          <Text style={authStyles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
