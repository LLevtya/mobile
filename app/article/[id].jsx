import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image } from "expo-image";
import LoadingSpinner from "../../components/LoadingSpinner";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const ArticleScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchArticle = async () => {
    try {
      const res = await fetch(`https://yalm-app-project.onrender.com/api/content/${id}`);
      const data = await res.json();
      setArticle(data);
    } catch (err) {
      console.error("Error fetching article:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading article..." />;

  if (!article) return <Text style={styles.errorText}>Article not found.</Text>;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color={COLORS.textDark} />
      </TouchableOpacity>

      <Image
        source={{ uri: article.image }}
        style={styles.image}
        contentFit="cover"
      />

      <View style={styles.content}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.meta}>
          {article.author && `By ${article.author} · `}
          {article.category}
        </Text>

        <Text style={styles.body}>{article.content}</Text>
      </View>
    </ScrollView>
  );
};

export default ArticleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  backButton: {
    position: "absolute",
    top: 48,
    left: 16,
    zIndex: 10,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 240,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: COLORS.textDark,
    marginBottom: 6,
  },
  meta: {
    fontSize: 13,
    color: COLORS.textLight,
    marginBottom: 14,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  errorText: {
    padding: 20,
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
});
