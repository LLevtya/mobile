import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Animated,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import ResultBar from "../../components/ResultBar";
import ConfettiCannon from "react-native-confetti-cannon";

const COLORS = ["#75B5E1", "#EA9EC6", "#FB8C65", "#FBCC04", "#A3CB5C"];

export default function TestPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [test, setTest] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetch(`https://yalm-app-project.onrender.com/api/tests/${id}`)
      .then((res) => res.json())
      .then((data) => setTest(data))
      .catch((err) => console.error("Failed to fetch test:", err));
  }, [id]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [currentIndex]);



  const handleAnswer = (score) => {
    const updated = [...answers, score];
    setAnswers(updated);

    if (test && updated.length === test.questions.length) {
      calculateResult(updated);
    } else {
      setCurrentIndex((prev) => prev + 1);
      fadeAnim.setValue(0); // Reset for next question animation
    }
  };

  const calculateResult = (answers) => {
    const scores = {};

    test.questions.forEach((q, i) => {
      scores[q.trait] = (scores[q.trait] || 0) + answers[i];
    });

    const maxScorePerTrait = test.questions.filter((q) => q.trait).length * 5;
    const normalized = Object.entries(scores).map(([trait, score]) => ({
      trait,
      score: Math.round((score / maxScorePerTrait) * 100),
    }));

    setResult(normalized);
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
    fadeAnim.setValue(0);
  };

  if (!test) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{test.title}</Text>
      <Text style={styles.description}>{test.description}</Text>

      {result ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Your Results</Text>
          {result.map((r, index) => (
            <ResultBar
              key={index}
              trait={r.trait}
              score={r.score}
              color={COLORS[index % COLORS.length]}
            />
          ))}

          
          <TouchableOpacity
            style={[styles.button, styles.goHome]}
            onPress={() => router.push("/")}
          >
            <Text style={styles.buttonText}>Go Home</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.retake]} onPress={handleRetake}>
            <Text style={styles.buttonText}>Retake Test</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Animated.View style={{ opacity: fadeAnim }}>
  {/* Question count */}
  <Text style={styles.questionCount}>
    Question {currentIndex + 1} of {test.questions.length}
  </Text>

  {/* Question text */}
  <Text style={styles.question}>{test.questions[currentIndex].text}</Text>

  {/* Options circles */}
  <View style={styles.optionsContainer}>
    {[1, 2, 3, 4, 5].map((val, i) => (
      <TouchableOpacity
        key={i}
        style={[styles.circle, { backgroundColor: COLORS[i % COLORS.length] }]}
        onPress={() => handleAnswer(val)}
      >
        <Text style={styles.circleText}>{val}</Text>
      </TouchableOpacity>
    ))}
  </View>

  {/* Scale labels below circles */}
  <View style={styles.scaleLabelsContainer}>
    <Text style={styles.scaleLabel}>1 - Strongly Disagree</Text>
    <Text style={styles.scaleLabel}>5 - Strongly Agree</Text>
  </View>
</Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 10,
    textAlign: "center",
  },
  questionCount: {
  fontSize: 14,
  fontWeight: "600",
  color: "#777",
  textAlign: "center",
  marginBottom: 8,
},

scaleLabelsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 40,
  paddingHorizontal: 8,
},

scaleLabel: {
  fontSize: 12,
  color: "#555",
  width: 150,
  textAlign: "center",
},

  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 30,
    textAlign: "center",
  },
  question: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    color: "#222",
    textAlign: "center",
  },
  optionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  circle: {
    width: 55,
    height: 55,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  circleText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resultContainer: {
    marginTop: 30,
    paddingBottom: 40,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#222",
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  goHome: {
    backgroundColor: "#4D96FF",
  },
  retake: {
    backgroundColor: "#6BCB77",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
