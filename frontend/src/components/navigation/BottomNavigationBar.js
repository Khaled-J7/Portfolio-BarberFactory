// src/components/navigation/BottomNavigationBar.js
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomNavigationBar = ({ navigation }) => {
  const [isBarber, setIsBarber] = useState(false);

  useEffect(() => {
    checkUserType();
  }, []);

  const checkUserType = async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      if (userData) {
        const { isBarber } = JSON.parse(userData);
        setIsBarber(isBarber);
      }
    } catch (error) {
      console.error("Error checking user type:", error);
    }
  };

  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Explore")}
      >
        <Feather name="search" size={24} color="#fff" />
        <Text style={styles.navText}>Explore</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Home")}
      >
        <Feather name="home" size={24} color="#fff" />
        <Text style={styles.navText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.navItem, styles.activeNav]}>
        <Feather
          name={isBarber ? "shopping-bag" : "user"}
          size={24}
          color="#6EC207"
        />
        <Text style={[styles.navText, styles.activeText]}>Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate("Appointments")}
      >
        <Feather name="calendar" size={24} color="#fff" />
        <Text style={styles.navText}>Bookings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    height: 65,
  },
  tabContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: "100%", // Ensure full height usage
    paddingVertical: 2, // Small padding for better spacing
  },
  icon: {
    height: 24,
    marginBottom: 4,
  },
  tabText: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#262525",
    textAlign: "center", // Ensure text centering
    includeFontPadding: false, // Remove extra font padding
    lineHeight: 16, // Consistent line height
  },
  activeTabText: {
    color: "#2ECC71",
    fontFamily: "Poppins-Bold",
  },
});

export default BottomNavigationBar;
