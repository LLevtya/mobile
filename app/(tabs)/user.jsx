import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useRouter } from "expo-router";

export default function Profile() {
  const { isLoading, user, token } = useAuthStore();
  const router = useRouter();

  // Moods for selection & history matching
  const moods = [
    { key: "angry", label: "Angry", image: require("../../assets/images/Angry.png") },
    { key: "upset", label: "Upset", image: require("../../assets/images/Upset.png") },
    { key: "sad", label: "Sad", image: require("../../assets/images/Sad.png") },
    { key: "good", label: "Good", image: require("../../assets/images/Good.png") },
    { key: "happy", label: "Happy", image: require("../../assets/images/Happy.png") },
    { key: "spectacular", label: "Spectacular", image: require("../../assets/images/Spectacular.png") },
  ];

  const [refreshing, setRefreshing] = useState(false);
  const [moodLoggedToday, setMoodLoggedToday] = useState(false);
  const [checkingMood, setCheckingMood] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);

  // Check if user logged mood today
  useEffect(() => {
    const checkMood = async () => {
      try {
        const res = await fetch("https://yalm-app-project.onrender.com/api/mood/check-today", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setMoodLoggedToday(data.loggedToday);
      } catch (error) {
        console.error("Mood check failed", error);
      } finally {
        setCheckingMood(false);
      }
    };

    checkMood();
  }, [token]);

  // Fetch mood history (last 7)
  useEffect(() => {
    const fetchMoodHistory = async () => {
      try {
        const res = await fetch("https://yalm-app-project.onrender.com/api/mood/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setMoodHistory(data.history);
        } else {
          console.error("Failed to fetch mood history:", data.message);
        }
      } catch (error) {
        console.error("Mood history fetch error:", error);
      }
    };

    if (token) fetchMoodHistory();
  }, [token]);

  const submitMood = async () => {
    if (!selectedMood) {
      Alert.alert("Select Mood", "Please select your mood before submitting.");
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch("https://yalm-app-project.onrender.com/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mood: selectedMood }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMoodLoggedToday(true);
      Alert.alert("Success", "Mood logged successfully.");
      setSelectedMood(null);
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to log mood.");
    } finally {
      setSubmitting(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // You can refresh user data here if needed
      // For now, just re-check mood and history
      setCheckingMood(true);
      const resMood = await fetch("https://yalm-app-project.onrender.com/api/mood/check-today", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataMood = await resMood.json();
      setMoodLoggedToday(dataMood.loggedToday);
      setCheckingMood(false);

      const resHistory = await fetch("https://yalm-app-project.onrender.com/api/mood/history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dataHistory = await resHistory.json();
      if (resHistory.ok) setMoodHistory(dataHistory.history);
    } catch {
      Alert.alert("Error", "Failed to refresh data.");
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  
  const actions = [
    {
      icon: "key-outline",
      label: "Change Password",
      onPress: () => router.push("/(auth)/changepassword"),
    },
    {
      icon: "information-circle-outline",
      label: "About",
      onPress: () =>
    Alert.alert(
      "About this App",
      "This is Yalm, a psychology app designed to help you track your mood daily and support your mental wellbeing."
    ),
    },
    {
    icon: "mail-outline",
    label: "Contact",
    onPress: () => Alert.alert("Contact", "You can reach us at: yalm.amgr@gmail.com yalm.llagr@gmail.com"),
  },
  ];

  return (
    <FlatList
      data={actions}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
      ListHeaderComponent={
        <>
          <ProfileHeader />

          {/* Member since & Edit profile */}
          <View style={styles.profileMeta}>
            <Text style={styles.memberSince}>
              Member since:{" "}
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
            </Text>
          </View>

          {/* Mood selector section */}
          <View style={{ marginVertical: 30 }}>
            <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
              How are you feeling today?
            </Text>

            {checkingMood ? (
              <ActivityIndicator size="small" color="#4F46E5" />
            ) : moodLoggedToday ? (
              <Text style={{ fontSize: 16, color: "#444" }}>
                Thanks for logging your mood today!
              </Text>
            ) : (
              <>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingVertical: 10 }}
                >
                  {moods.map((item) => (
                    <TouchableOpacity
                      key={item.key}
                      style={{
                        alignItems: "center",
                        marginRight: 16,
                        borderWidth: selectedMood === item.key ? 3 : 0,
                        borderColor: "#4F46E5",
                        borderRadius: 14,
                        padding: 8,
                      }}
                      onPress={() => setSelectedMood(item.key)}
                    >
                      <Image source={item.image} style={{ width: 80, height: 80, marginBottom: 8, borderRadius: 18 }}
/>
                      <Text style={{ fontSize: 16, fontWeight: "600", color: "#111" }}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {selectedMood && (
                  <TouchableOpacity
                    onPress={submitMood}
                    disabled={submitting}
                    style={{
                      marginTop: 16,
                      backgroundColor: submitting ? "#a2a2f8" : "#4F46E5",
                      paddingVertical: 14,
                      borderRadius: 14,
                      alignItems: "center",
                      shadowColor: "#4F46E5",
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.3,
                      shadowRadius: 6,
                      elevation: 6,
                    }}
                  >
                    {submitting ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
                        Submit Mood
                      </Text>
                    )}
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {/* Simple recent mood history */}
          <View style={{ marginTop: 40 }}>
            <Text style={{ fontSize: 20, fontWeight: "700", marginBottom: 12 }}>
              Recent Moods
            </Text>
            {moodHistory.length === 0 ? (
              <Text style={{ color: "#6B7280", fontStyle: "italic" }}>
                No mood history yet.
              </Text>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingVertical: 6 }}>
                {moodHistory.map((entry, idx) => {
                  const moodObj = moods.find((m) => m.key === entry.mood);
                  return (
                    <View
                      key={idx}
                      style={{
                        alignItems: "center",
                        backgroundColor: "#f0f0f0",
                        padding: 12,
                        borderRadius: 12,
                        marginRight: 14,
                        minWidth: 90,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.1,
                        shadowRadius: 2,
                      }}
                    >
                      {moodObj && (
                        <Image
                          source={moodObj.image}
                          style={{ width: 50, height: 50, marginBottom: 6, borderRadius: 11}}
                        />
                      )}
                      <Text style={{ fontWeight: "600", textTransform: "capitalize" }}>
                        {entry.mood}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#555" }}>
                        {new Date(entry.date).toLocaleDateString()}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Section title for actions */}
          <Text style={[styles.sectionTitle, { marginTop: 40 }]}>Settings</Text>
        </>
      }
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.actionItem} onPress={item.onPress}>
          <Ionicons name={item.icon} size={20} color="#1D4ED8" />
          <Text style={styles.actionText}>{item.label}</Text>
        </TouchableOpacity>
      )}
      ListFooterComponent={
        <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
          <LogoutButton />
        </View>
      }
    />
  );
}


