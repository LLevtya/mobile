import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  RefreshControl,
  FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import ContentCard from "../../components/ContentCard";
import TestCard from "../../components/TestCard";

export default function SearchScreen() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Step 1: fetch basic test & article lists
      const [testsRes, articlesRes] = await Promise.all([
        fetch("https://yalm-app-project.onrender.com/api/tests"),
        fetch("https://yalm-app-project.onrender.com/api/content"),
      ]);

      const testsList = await testsRes.json();
      const articlesList = await articlesRes.json();

      // Step 2: fetch full test info (with image)
      const testsFull = await Promise.all(
        testsList.map(async (test) => {
          const res = await fetch(`https://yalm-app-project.onrender.com/api/tests/${test._id}`);
          if (res.ok) return await res.json();
          return test;
        })
      );

      // Step 3: fetch full article info (with image)
      const articlesFull = await Promise.all(
        articlesList.map(async (article) => {
          const res = await fetch(`https://yalm-app-project.onrender.com/api/content/${article._id}`);
          if (res.ok) return await res.json();
          return article;
        })
      );

      setTests(testsFull);
      setArticles(articlesFull);
    } catch (error) {
      console.error("Error loading search data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const filteredTests = tests.filter((t) =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.searchBar}>
  <TextInput
    placeholder="Search tests or articles..."
    placeholderTextColor="#999"
    style={styles.searchInput}
    value={searchTerm}
    onChangeText={setSearchTerm}
  />
</View>

      {/* Tests Section */}
      <Text style={styles.sectionTitle}>Tests</Text>
      <FlatList
        data={filteredTests}
        renderItem={({ item }) => <TestCard test={item} />}
        keyExtractor={(item) => item._id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 8 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No matching tests.</Text>
        }
      />

      {/* Articles Section */}
      <Text style={styles.sectionTitle}>Articles</Text>
      <FlatList
        data={filteredArticles}
        renderItem={({ item }) => <ContentCard article={item} />}
        keyExtractor={(item) => item._id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={{ gap: 8 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No matching articles.</Text>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
  backgroundColor: "#f1f1f1",
  borderRadius: 24,
  paddingHorizontal: 16,
  paddingVertical: 16,
  marginBottom: 20,
  flexDirection: "row",
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.05,
  shadowRadius: 2,
  elevation: 1,
},

searchInput: {
  flex: 1,
  fontSize: 16,
  color: "#333",
},

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 12,
  },
  emptyText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    marginVertical: 10,
  },
});
