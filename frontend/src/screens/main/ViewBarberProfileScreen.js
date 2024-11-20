import React, { useState, useEffect } from "react";
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
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BookingModal from "../booking/BookingModal";

const { width } = Dimensions.get("window");

const ViewBarberProfileScreen = ({ route, navigation }) => {
  const { shopData } = route.params;
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [isShopOwner, setIsShopOwner] = useState(false);

  useEffect(() => {
    checkOwnership();
  }, []);

  /**
   * Determines if current user is the owner of the viewed shop
   * Controls visibility of "Book Now" button
   */
  const checkOwnership = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");  // userData from AsyncStorage (contains current user info)
      if (userData) {
        const parsedData = JSON.parse(userData);
        console.log("Current user data:", parsedData); // Debug
        console.log("Shop data:", shopData);  // Debug

        // Compare user ID with shop owner ID
        if (shopData.owner) { // shopData from route.params (contains shop info including owner ID)
          
          // Compare current user ID with shop owner ID
          const isOwner = parsedData.id === shopData.owner;
          console.log("Is owner check:", isOwner);
          // Update state based on comparison
          setIsShopOwner(isOwner);
        } else {
          console.log("Shop owner ID not found in shop data");
          // If no owner field, assume not owner
          setIsShopOwner(false);
        }
      }
    } catch (error) {
      console.error("Error checking ownership:", error);
      setIsShopOwner(false);  // On any error, assume not owner
    }
  };

  /**
   * Handle booking modal close
   */
  const handleCloseModal = () => {
    setShowBookingModal(false);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/BlackThemeBackgroundImage.jpg")}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: !isShopOwner ? 100 : 20 }}
      >
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
            {shopData.galleryImages?.map((image, index) => (
              <View key={index} style={styles.galleryImageContainer}>
                <Image source={{ uri: image }} style={styles.galleryImage} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Booking Button - Only shown if not shop owner */}
      {!isShopOwner && (
        <View style={styles.bookingButtonContainer}>
          <TouchableOpacity
            style={styles.bookingButton}
            onPress={() => setShowBookingModal(true)}
          >
            <LinearGradient
              colors={["#2ECC71", "#27AE60"]}
              style={styles.bookingGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.bookingButtonText}>Book Now</Text>
              <Feather name="calendar" size={20} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}

      {/* Booking Modal */}
      <BookingModal
        visible={showBookingModal}
        onClose={handleCloseModal}
        shopData={shopData}
      />
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
  // New styles for booking button
  bookingButtonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(10px)",
  },
  bookingButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  bookingGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    gap: 10,
  },
  bookingButtonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#FFFFFF",
  },
});

export default ViewBarberProfileScreen;
