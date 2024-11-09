//  src/screens/main/ViewBarberProfileScreen.js (read-only mode for BarberProfileScreen)
/*
  - Removed interactive elements
  - Added back navigation
  - Everything else remains the same (BarberProfileScreen)
*/

import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  Platform,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const ViewBarberProfileScreen = ({ route, navigation }) => {
  const { shopData } = route.params;
  useEffect(() => {
    console.log("Shop Data in ViewBarberProfileScreen:", shopData); // Debug
  }, [shopData]);

  return (
    <ImageBackground
      source={require("../../assets/images/BlackThemeBackgroundImage.jpg")}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Button */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={{ uri: shopData.coverImage }}
            style={styles.coverImage}
          />
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop Information</Text>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Barbershop Name</Text>
              <Text style={styles.infoValue}>{shopData.name}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{shopData.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{shopData.address}</Text>
            </View>
          </View>
        </View>

        {/* Gallery Section */}
        <View style={styles.gallerySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
          </View>

          <View style={styles.galleryGrid}>
            {shopData.galleryImages.map((image, index) => (
              <View key={index} style={styles.galleryImageContainer}>
                <Image source={{ uri: image }} style={styles.galleryImage} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  coverContainer: {
    height: 200,
    width: "100%",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 28,
    color: "#6EC207",
  },
  infoItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#6EC207",
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#FFFFFF",
  },
  gallerySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  galleryImageContainer: {
    width: (width - 52) / 3,
    height: (width - 52) / 3,
    borderRadius: 10,
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
});

export default ViewBarberProfileScreen;
