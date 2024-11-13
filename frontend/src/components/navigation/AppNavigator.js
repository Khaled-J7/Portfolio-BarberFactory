/**
 * Main Navigation Configuration
 * Handles both Stack and Tab Navigation for the entire app
 */

import React, { useState, useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";

// Auth Screen Imports
import SplashScreen from "../../screens/auth/SplashScreen";
import LoginSignupScreen from "../../screens/auth/LoginSignupScreen";
import WelcomeBarberScreen from "../../screens/auth/WelcomeBarberScreen";

// Main Screen Imports
import HomeScreen from "../../screens/main/HomeScreen";
import ClientProfileScreen from "../../screens/main/ClientProfileScreen";
import CreateShopScreen from "../../screens/main/CreateShopScreen";
import BarberProfileScreen from "../../screens/main/BarberProfileScreen";
import SettingsScreen from "../../screens/main/SettingsScreen";
import ViewBarberProfileScreen from "../../screens/main/ViewBarberProfileScreen";
import AboutScreen from "../../screens/main/AboutScreen";
import ExploreScreen from "../../screens/main/ExploreScreen";

// Booking Screen Imports
import BarberBookingsScreen from "../../screens/booking/BarberBookingsScreen";
import ClientBookingsScreen from "../../screens/booking/ClientBookingsScreen";

// Navigation Creators
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

/**
 * Bottom Tab Navigator Component
 * Handles the main app's bottom navigation
 * Different profile screens based on user type (Barber/Client)
 */
function MainTabNavigator() {
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
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E5E5E5",
        },
        tabBarActiveTintColor: "#2ECC71",
        tabBarInactiveTintColor: "#262525",
      }}
    >
      {/* Explore Tab - Map and Location Search */}
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="search" size={24} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins-Regular" },
        }}
      />

      {/* Home Tab - Main Feed */}
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="home" size={24} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins-Regular" },
        }}
      />

      {/* Profile Tab - Conditional Rendering based on User Type */}
      <Tab.Screen
        name="Profile"
        component={isBarber ? BarberProfileScreen : ClientProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="user" size={24} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins-Regular" },
        }}
      />

      {/* Bookings Tab - Appointment Management */}
      <Tab.Screen
        name="Bookings"
        component={isBarber ? BarberBookingsScreen : ClientBookingsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Feather name="calendar" size={24} color={color} />
          ),
          tabBarLabelStyle: { fontFamily: "Poppins-Regular" },
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Main App Navigator
 * Handles the overall navigation structure of the app
 * Including authentication flow and main app flow
 */
export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {/* Authentication Flow Screens */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
      <Stack.Screen name="WelcomeBarber" component={WelcomeBarberScreen} />
      <Stack.Screen name="CreateShop" component={CreateShopScreen} />

      {/* Main App Flow - Contains Tab Navigator */}
      <Stack.Screen name="MainApp" component={MainTabNavigator} />

      {/* Additional Screens - Accessible from anywhere */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen 
        name="ViewBarberProfile" 
        component={ViewBarberProfileScreen} 
      />
      <Stack.Screen name="About" component={AboutScreen} />
    </Stack.Navigator>
  );
}