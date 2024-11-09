import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Feather } from '@expo/vector-icons';

// Auth Screens
import SplashScreen from '../../screens/auth/SplashScreen';
import LoginSignupScreen from '../../screens/auth/LoginSignupScreen';
import WelcomeBarberScreen from '../../screens/auth/WelcomeBarberScreen';

// Main Screens
import HomeScreen from '../../screens/main/HomeScreen';
import CreateShopScreen from '../../screens/main/CreateShopScreen';
import BarberProfileScreen from '../../screens/main/BarberProfileScreen';
import SettingsScreen from '../../screens/main/SettingsScreen';
import ViewBarberProfileScreen from '../../screens/main/ViewBarberProfileScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 65,
          paddingTop: 10,
          paddingBottom: 10,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E5E5',
        },
        tabBarActiveTintColor: '#2ECC71',
        tabBarInactiveTintColor: '#262525',
      }}
    >
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="search" size={24} color={color} />,
          tabBarLabelStyle: { fontFamily: 'Poppins-Regular' }
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="home" size={24} color={color} />,
          tabBarLabelStyle: { fontFamily: 'Poppins-Regular' }
        }}
      />
      <Tab.Screen
        name="Profile"
        component={BarberProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="user" size={24} color={color} />,
          tabBarLabelStyle: { fontFamily: 'Poppins-Regular' }
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} />,
          tabBarLabelStyle: { fontFamily: 'Poppins-Regular' }
        }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
export function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
      }}
    >
      {/* Auth Screens */}
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="LoginSignup" component={LoginSignupScreen} />
      <Stack.Screen name="WelcomeBarber" component={WelcomeBarberScreen} />
      <Stack.Screen name="CreateShop" component={CreateShopScreen} />
      
      {/* Main App Flow */}
      <Stack.Screen name="MainApp" component={MainTabNavigator} />
      
      {/* Other Screens */}
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen 
        name="ViewBarberProfile" 
        component={ViewBarberProfileScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}