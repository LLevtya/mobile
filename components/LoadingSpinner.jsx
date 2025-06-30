import React from "react";
import { ActivityIndicator, Text, View, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

export default LoadingSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff", // optional background color
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: "#333",
  },
});
