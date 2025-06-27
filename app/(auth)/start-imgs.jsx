import React, { useRef, useState } from "react";
import {
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { authStyles } from "../../assets/styles/auth.styles";


const { width, height } = Dimensions.get("window");

const images = [
  require("../../assets/images/startpage1.png"),
  require("../../assets/images/startpage2.png"),
  require("../../assets/images/startpage3.png"),
];

export default function StartImgs() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const router = useRouter();

  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <Image
            source={item}
            style={{ width, height }}
            contentFit="cover"
            transition={300}
          />
        )}
        onViewableItemsChanged={onViewRef.current}
        viewabilityConfig={viewConfigRef.current}
      />

      {/* Dots */}
      <View style={authStyles.dotsContainer}>
        {images.map((_, index) => (
          <View
            key={index}
            style={[
              authStyles.dot,
              {
                backgroundColor:
                  currentIndex === index ? "#0004FF" : "#bbb",
              },
            ]}
          />
        ))}
      </View>

      {/* Sign Up Button on Last Slide */}
      {currentIndex === images.length - 1 && (
        <View
          style={{
            position: "absolute",
            bottom: 40,
            width: "100%",
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("/(auth)/sign-up")}
            style={{
              backgroundColor: "#000",
              paddingVertical: 15,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
