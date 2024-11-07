// App.js
import 'react-native-gesture-handler';  // Must be first import
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginSignupScreen from './src/screens/auth/LoginSignupScreen';
import WelcomeBarberScreen from './src/screens/auth/WelcomeBarberScreen';
import CreateShopScreen from './src/screens/main/CreateShopScreen';
import BarberProfileScreen from './src/screens/main/BarberProfileScreen';
import HomeScreen from './src/screens/main/HomeScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="LoginSignup"
          component={LoginSignupScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="WelcomeBarber"
          component={WelcomeBarberScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="CreateShop"
          component={CreateShopScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="BarberProfile"
          component={BarberProfileScreen}
          options={{ gestureEnabled: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;