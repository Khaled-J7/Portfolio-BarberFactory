import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define route names for better type safety
const ROUTES = {
  EXPLORE: 'Explore',
  HOME: 'Home',
  PROFILE: 'Profile',
  BARBER_PROFILE: 'BarberProfile',
  BOOKINGS: 'Bookings'
};


/**
 * Function to determine if a route should be marked as active
 * @param {string} currentRoute - The current route name from navigation
 * @param {string} itemRoute - The route name of the navigation item
 * @returns {boolean} - Whether the route should be marked as active
 */
const isRouteActive = (currentRoute, itemRoute) => {
  // Special case for Profile/BarberProfile
  if (itemRoute === ROUTES.PROFILE && currentRoute === ROUTES.BARBER_PROFILE) {
    return true;
  }
  return currentRoute === itemRoute;
};

const BottomNavigationBar = ({ navigation, route }) => {
  const [isBarber, setIsBarber] = useState(false);
  const currentRoute = route?.name || ROUTES.HOME;

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
      navigation.navigate(ROUTES.BARBER_PROFILE);
    } else {
      // Will be implemented when ClientProfile is ready
      console.log("Client profile not implemented yet");
    }
  };

  const navigationItems = [
    {
      name: ROUTES.EXPLORE,
      icon: "search",
      onPress: () => navigation.navigate(ROUTES.EXPLORE),
    },
    {
      name: ROUTES.HOME,
      icon: "home",
      onPress: () => navigation.navigate(ROUTES.HOME),
    },
    {
      name: ROUTES.PROFILE,
      icon: "user",
      onPress: handleProfilePress,
    },
    {
      name: ROUTES.BOOKINGS,
      icon: "calendar",
      onPress: () => navigation.navigate(ROUTES.BOOKINGS),
    },
  ];

  const renderNavigationItem = ({ name, icon, onPress }) => {
    const isActive = isRouteActive(currentRoute, name);
    
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