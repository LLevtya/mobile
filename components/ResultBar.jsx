// components/ResultBar.jsx
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export default function ResultBar({ trait, score, color = "#4F46E5" }) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: score,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [score]);

  const interpolatedWidth = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{trait}</Text>
        <Text style={styles.percent}>{score}%</Text>
      </View>

      <View style={styles.barContainer}>
        <Animated.View style={[styles.bar, { width: interpolatedWidth, backgroundColor: color }]} />
        <Animated.View
          style={[
            {
              left: animatedWidth.interpolate({
                inputRange: [0, 100],
                outputRange: ["0%", "100%"],
              }),
              borderColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  percent: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  barContainer: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 6,
    overflow: "hidden",
    position: "relative",
  },
  bar: {
    height: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    borderRadius: 6,
  },
  knob: {
    position: "absolute",
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    backgroundColor: "#fff",
  },
});
