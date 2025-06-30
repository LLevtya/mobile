import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function TestLayout({ test, onFinish }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  if (!test || !test.questions || test.questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No questions available</Text>
      </View>
    );
  }

  const currentQuestion = test.questions[currentIndex];

  const handleAnswer = (score) => {
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = { questionId: currentQuestion._id, score };

      if (currentIndex + 1 >= test.questions.length) {
        onFinish(newAnswers);
      } else {
        setCurrentIndex(currentIndex + 1);
      }

      return newAnswers;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.titleContainer}>
  <Text style={styles.titleText}>{test.title}</Text>
</View>
      <Text style={styles.questionCounter}>
        Question {currentIndex + 1} of {test.questions.length}
      </Text>
      <Text style={styles.questionText}>{currentQuestion.text}</Text>

      <View style={styles.optionsContainer}>
        {[1, 2, 3, 4, 5].map((score) => (
          <TouchableOpacity
            key={score}
            style={[styles.optionButton, styles[`color${score}`]]}
            onPress={() => handleAnswer(score)}
          >
            <Text style={styles.optionText}>{score}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.scaleDescription}>
        <Text style={styles.scaleLabel}>1 = Strongly Disagree</Text>
        <Text style={styles.scaleLabel}>5 = Strongly Agree</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fefefe",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 100,
    textAlign: "center",
    color: "#333",
  },
  questionCounter: {
    fontSize: 14,
    marginBottom: 8,
    textAlign: "center",
    color: "#666",
  },
  questionText: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: "center",
    color: "#222",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  optionButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 4,
  },
  titleContainer: {
  backgroundColor: "#f0f4ff",
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 12,
  marginBottom: 24,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 2,
  alignSelf: "center",
  maxWidth: "90%",
},
titleText: {
  fontSize: 22,
  fontWeight: "700",
  textAlign: "center",
  color: "#3b3b3b",
},

  optionText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
  scaleDescription: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  scaleLabel: {
    fontSize: 13,
    color: "#777",
  },

  // Option color shades
  color1: { backgroundColor: "#e74c3c" },
  color2: { backgroundColor: "#e67e22" },
  color3: { backgroundColor: "#f1c40f" },
  color4: { backgroundColor: "#2ecc71" },
  color5: { backgroundColor: "#3498db" },
});
