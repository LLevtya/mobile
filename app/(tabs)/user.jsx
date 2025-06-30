import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../../store/authStore";
import styles from "../../assets/styles/profile.styles";
import ProfileHeader from "../../components/ProfileHeader";
import LogoutButton from "../../components/LogoutButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import { sleep } from ".";

export default function Profile() {
  const { isLoading, user } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await sleep(1000); // Replace with real fetch
    } catch (err) {
      Alert.alert("Error", "Failed to refresh");
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading && !refreshing) {
    return <LoadingSpinner message="Loading content..." />;
  }

  const actions = [
    {
      icon: "key-outline",
      label: "Change Password",
      onPress: () => Alert.alert("Change Password"),
    },
    {
      icon: "settings-outline",
      label: "App Settings",
      onPress: () => Alert.alert("App Settings"),
    },
    {
      icon: "information-circle-outline",
      label: "About",
      onPress: () => Alert.alert("About this App"),
    },
  ];

  return (
    <FlatList
      data={actions}
      keyExtractor={(item, index) => index.toString()}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={{ paddingBottom: 40 }}
      ListHeaderComponent={
        <>
          <ProfileHeader />

          {/* Member Since & Edit Profile */}
          <View style={styles.profileMeta}>
            <Text style={styles.memberSince}>
              Member since:{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => Alert.alert("Edit Profile")}
            >
              <Ionicons name="create-outline" size={18} color="#1D4ED8" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          

          {/* Section Title */}
          <Text style={styles.sectionTitle}>Settings</Text>
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
