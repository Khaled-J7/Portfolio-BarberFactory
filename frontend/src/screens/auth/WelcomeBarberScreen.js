// src/screens/auth/WelcomeBarberScreen.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
  Animated,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";

const WelcomeBarberScreen = ({ navigation }) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const textOpacity = useRef(new Animated.Value(0)).current;
  const buttonOpacity = useRef(new Animated.Value(0)).current;

  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  useEffect(() => {
    if (isImageLoaded) {
      Animated.sequence([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1000,
          delay: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isImageLoaded, textOpacity, buttonOpacity]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/welcomeScreen.jpeg')}
      style={styles.backgroundImage}
      onLoadEnd={() => setIsImageLoaded(true)}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.contentContainer}>
            {isImageLoaded && (
              <>
                <Animated.View style={{ opacity: textOpacity }}>
                  <Text style={styles.welcomeText}>
                    Welcome to Barber Factory
                  </Text>
                  <Text style={styles.messageText}>
                    Join our community of professional barbers and showcase your
                    expertise to clients who appreciate the art of grooming.
                  </Text>
                </Animated.View>

                <Animated.View style={{ opacity: buttonOpacity }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('CreateShopScreen')}
                  >
                    <LinearGradient
                      colors={["#2ECC71", "#27AE60"]}
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.buttonText}>GET STARTED</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  welcomeText: {
    fontFamily: "Poppins-Regular",
    fontSize: 32,
    color: "#E4E0E1",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  messageText: {
    fontFamily: "Poppins-Regular",
    fontSize: 18,
    color: "#EEEDEB",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 40,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    width: 280,
    marginTop: 20,
  },
  buttonGradient: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Poppins-Bold",
    fontSize: 16,
    color: "#000000",
  },
});

export default WelcomeBarberScreen;
