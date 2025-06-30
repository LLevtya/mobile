import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuthStore } from "../store/authStore";
import { Image } from "expo-image";
import styles from "../assets/styles/profile.styles";

export default function ProfileHeader() {
  const { user, updateUserImage } = useAuthStore(); // Assume you can update profile image

  if (!user) return null;

  const handleChangeImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      return Alert.alert("Permission Denied", "We need access to your photos.");
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      const selectedUri = result.assets[0].uri;
      // Upload or update the image
      updateUserImage(selectedUri); // You need to define this in your store
    }
  };

  return (
    <View style={styles.profileHeader}>
      <TouchableOpacity onPress={handleChangeImage}>
        <Image
          source={{ uri: user.profileImage }}
          style={styles.profileImage}
        />
      </TouchableOpacity>

      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>
    </View>
  );
}
