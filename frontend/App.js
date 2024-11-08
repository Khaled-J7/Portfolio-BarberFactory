// App.js
import 'react-native-gesture-handler';  // Must be first import
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Screen imports
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginSignupScreen from './src/screens/auth/LoginSignupScreen';
import WelcomeBarberScreen from './src/screens/auth/WelcomeBarberScreen';
import CreateShopScreen from './src/screens/main/CreateShopScreen';
import BarberProfileScreen from './src/screens/main/BarberProfileScreen';
import HomeScreen from './src/screens/main/HomeScreen';
import SettingsScreen from './src/screens/main/SettingsScreen';

// Define screen names as constants to avoid typos
export const ROUTES = {
  SPLASH: 'Splash',
  LOGIN_SIGNUP: 'LoginSignup',
  WELCOME_BARBER: 'WelcomeBarber',
  CREATE_SHOP: 'CreateShop',
  BARBER_PROFILE: 'BarberProfile',
  HOME: 'Home',
  SETTINGS: 'Settings',
  EXPLORE: 'Explore',
  BOOKINGS: 'Bookings'
};

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={ROUTES.SPLASH}
        screenOptions={{
          headerShown: false,
          gestureEnabled: false
        }}
      >
        <Stack.Screen
          name={ROUTES.SPLASH}
          component={SplashScreen}
        />
        <Stack.Screen
          name={ROUTES.LOGIN_SIGNUP}
          component={LoginSignupScreen}
        />
        <Stack.Screen
          name={ROUTES.WELCOME_BARBER}
          component={WelcomeBarberScreen}
        />
        <Stack.Screen
          name={ROUTES.CREATE_SHOP}
          component={CreateShopScreen}
        />
        <Stack.Screen
          name={ROUTES.BARBER_PROFILE}
          component={BarberProfileScreen}
        />
        <Stack.Screen
          name={ROUTES.HOME}
          component={HomeScreen}
        />
        <Stack.Screen
          name={ROUTES.SETTINGS}
          component={SettingsScreen}
        />
        {/* Add these screens for bottom navigation completeness */}
        <Stack.Screen
          name={ROUTES.EXPLORE}
          component={HomeScreen} // Temporarily using HomeScreen until Explore is implemented
        />
        <Stack.Screen
          name={ROUTES.BOOKINGS}
          component={HomeScreen} // Temporarily using HomeScreen until Bookings is implemented
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;