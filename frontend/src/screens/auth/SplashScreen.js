import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useFonts, BebasNeue_400Regular } from '@expo-google-fonts/bebas-neue';

const { width } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  // Initialize animated values
  const lineWidth = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Load custom font
  const [fontsLoaded] = useFonts({
    BebasNeue_400Regular,
  });

  useEffect(() => {
    // Start animations when component mounts
    opacity.value = withDelay(
      500, // Delay the fade in
      withTiming(1, {
        duration: 1000,
        easing: Easing.ease,
      })
    );

    // Animate the underline
    lineWidth.value = withDelay(
      1500, // Start after title appears
      withTiming(width * 0.7, {
        duration: 1500,
        easing: Easing.bezierCubic(0.4, 0, 0.2, 1),
      })
    );

    // Navigate to main screen after animations
    const timer = setTimeout(() => {
      navigation.replace('Login'); // Replace with your auth screen name
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // Define animated styles
  const titleStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
    opacity: opacity.value,
  }));

  if (!fontsLoaded) {
    return null; // Wait for font to load
  }

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Animated title */}
        <Animated.Text style={[styles.title, titleStyle]}>
          BarberFactory
        </Animated.Text>
        
        {/* Animated underline */}
        <Animated.View style={[styles.underline, lineStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#262525',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'BebasNeue_400Regular',
    fontSize: 48,
    color: '#2ECC71',
    marginBottom: 10,
  },
  underline: {
    height: 2,
    backgroundColor: '#2ECC71',
    borderRadius: 2,
    transform: [{ translateY: -5 }], // Adjust line position
    // Add subtle shadow for signature-like effect
    shadowColor: '#2ECC71',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default SplashScreen;