import 'react-native-gesture-handler';  // This must be the first import
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './src/screens/auth/SplashScreen';
import LoginSignupScreen from './src/screens/auth/LoginSignupScreen';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;