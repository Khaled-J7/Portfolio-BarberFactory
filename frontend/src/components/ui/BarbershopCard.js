// src/components/ui/BarbershopCard.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const BarbershopCard = ({
  shopName,
  address,
  phone,
  imageUrl,
  onBookPress,
  onPress,
}) => {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#F8F8F8"]}
      style={[styles.card, { overflow: "hidden" }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      onTouchEnd={onPress}  // to avoid getting clicked if we press on the other parts of the card
    >
      <View style={styles.contentContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.shopName}>{shopName}</Text>

          <View style={styles.infoContainer}>
            <Feather name="map-pin" size={16} color="#03346E" />
            <Text style={styles.infoText}>{address}</Text>
          </View>

          <View style={styles.infoContainer}>
            <Feather name="phone" size={16} color="#03346E" />
            <Text style={styles.infoText}>{phone}</Text>
          </View>

          <TouchableOpacity style={styles.bookButton} onPress={onBookPress}>
            <LinearGradient
              colors={["#2ECC71", "#27AE60"]}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Book Now</Text>
              <Feather name="arrow-right" size={18} color="#FFFFFF" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    width: width - 40,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  contentContainer: {
    flexDirection: "row",
    padding: 15,
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
    justifyContent: "space-between",
  },
  shopName: {
    fontFamily: "Poppins-Bold",
    fontSize: 18,
    color: "#005B41",
    marginBottom: 10,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#03346E",
    marginLeft: 8,
  },
  bookButton: {
    alignSelf: "flex-start",
    marginTop: 5,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    marginRight: 8,
  },
  imageContainer: {
    width: 100,
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});

export default BarbershopCard;
