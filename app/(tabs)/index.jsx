import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import ContentCard from "../../components/ContentCard";
import CategoryFilter from "../../components/CategoryFilter";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constants/colors";
import { homeStyles } from "../../assets/styles/home.styles";
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = () => {
  const router = useRouter();
  const [articles, setArticles] = useState([]);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dailyQuote, setDailyQuote] = useState(null);
  const [dailyTest, setDailyTest] = useState(null);

  // Fetch /api/content/daily (includes articles, quote, testId)
  const fetchDailyContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://yalm-app-project.onrender.com/api/content/daily");
      const data = await res.json();

      setArticles(data.articles || []);
      setFeaturedArticle(data.articles?.[0] || null);
      setDailyQuote(data.quote || null);
      
      if (data.testId) {
        // fetch test details by ID
        const testRes = await fetch(`https://yalm-app-project.onrender.com/api/tests/${data.testId}`);
        if (testRes.ok) {
          const testData = await testRes.json();
          setDailyTest(testData);
        } else {
          setDailyTest(null);
        }
      } else {
        setDailyTest(null);
      }
    } catch (error) {
      console.error("Error fetching daily content or test:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await fetch("https://yalm-app-project.onrender.com/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const loadContent = async () => {
    setLoading(true);
    await Promise.all([fetchUser(), fetchDailyContent()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadContent();
    setRefreshing(false);
  };

  useEffect(() => {
    loadContent();
  }, []);

  const filteredArticles = selectedCategory
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  if (loading && !refreshing) {
    return <LoadingSpinner message="Loading content..." />;
  }

  return (
    <ScrollView
      style={homeStyles.container}
      contentContainerStyle={homeStyles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={homeStyles.greetingText}>Hello, {user?.name || "Guest"} 👋</Text>

      {/* Quote from /daily */}
      {dailyQuote && (
        <View style={homeStyles.quoteBox}>
          <Text style={homeStyles.quoteText}>"{dailyQuote.text}"</Text>
          <Text style={homeStyles.quoteAuthor}>— {dailyQuote.author || "Unknown"}</Text>
        </View>
      )}

       {/* Featured Daily Test */}
      {dailyTest && (
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => router.push(`/test/${dailyTest._id}`)}
          activeOpacity={0.85}
        >
          <Image
            source={{ uri: dailyTest.image }}
            style={styles.featuredImage}
            contentFit="cover"
          />
          <View style={styles.featuredOverlay}>
            <Text style={styles.featuredTitle}>{dailyTest.title}</Text>
            <Text style={styles.featuredDescription} numberOfLines={2}>
              {dailyTest.description}
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Category Filter */}
      <CategoryFilter
        categories={[...new Set(articles.map((a) => a.category))].map((name) => ({ name }))}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Article Grid */}
      <View style={styles.grid}>
        <FlatList
          data={filteredArticles}
          renderItem={({ item }) => <ContentCard article={item} />}
          keyExtractor={(item) => item._id.toString()}
          numColumns={2}
          columnWrapperStyle={{ gap: 8 }}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  featuredCard: {
    height: 220,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 20,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  featuredImage: {
    height: "100%",
    width: "100%",
  },
  featuredOverlay: {
    position: "absolute",
    bottom: 0,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  featuredDescription: {
    fontSize: 14,
    color: "#f1f1f1",
    marginTop: 4,
  },
});

export default HomeScreen;
