import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BottomNavigationBar = ({ navigation, activeRoute = "Home" }) => {
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

  const handleProfilePress = () => {
    if (isBarber) {
      navigation.navigate("BarberProfile");
    } else {
      // Will navigate to ClientProfile when implemented
      console.log("Client profile not implemented yet");
    }
  };

  const navigationItems = [
    {
      name: "Explore",
      icon: "search",
      onPress: () => navigation.navigate("Explore"),
    },
    {
      name: "Home",
      icon: "home",
      onPress: () => navigation.navigate("Home"),
    },
    {
      name: "Profile",
      icon: "user",
      onPress: handleProfilePress,
    },
    {
      name: "Bookings",
      icon: "calendar",
      onPress: () => navigation.navigate("Bookings"),
    },
  ];

  const renderNavigationItem = ({ name, icon, onPress }) => {
    const isActive = activeRoute === name;
    
    return (
      <TouchableOpacity
        key={name}
        style={styles.tabContainer}
        onPress={onPress}
      >
        <Feather
          name={icon}
          size={24}
          color={isActive ? "#2ECC71" : "#262525"}
          style={styles.icon}
        />
        <Text
          style={[
            styles.tabText,
            isActive && styles.activeTabText
          ]}
        >
          {name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {navigationItems.map(renderNavigationItem)}
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
    height: "100%",
    paddingVertical: 2,
  },
  icon: {
    marginBottom: 4,
  },
  tabText: {
    fontFamily: "Poppins-Regular",
    fontSize: 11,
    color: "#262525",
    textAlign: "center",
    includeFontPadding: false,
    lineHeight: 16,
  },
  activeTabText: {
    color: "#2ECC71",
    fontFamily: "Poppins-Bold",
  },
});

export default BottomNavigationBar;