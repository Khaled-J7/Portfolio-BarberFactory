// src/screens/main/HomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigationBar from "../../components/navigation/BottomNavigationBar";
import CustomDrawer from "../../components/navigation/CustomDrawer";

const HomeScreen = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [userType, setUserType] = useState("client"); // 'client' or 'barber'

  // Fetch user type on component mount
  React.useEffect(() => {
    const getUserType = async () => {
      try {
        const userData = await AsyncStorage.getItem("userData");
        if (userData) {
          const { isBarber } = JSON.parse(userData);
          setUserType(isBarber ? "barber" : "client");
        }
      } catch (error) {
        console.error("Error fetching user type:", error);
      }
    };
    getUserType();
  }, []);

  const handleSearchPress = () => {
    // Will implement search functionality later
    console.log("Search pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setIsDrawerVisible(true)}
          style={styles.menuButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Better touch area
        >
          <Feather
            name="list"
            size={24}
            color="#262525"
            style={styles.menuIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <Feather name="home" size={24} color="#262525" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require("../../assets/images/appLogo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Discover nearby Barbershops</Text>

      {/* Content Area - Will be populated with barbershop cards */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Barbershop cards will be added here */}
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigationBar navigation={navigation} />

      {/* Drawer */}
      <CustomDrawer
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    height: Platform.OS === "ios" ? 90 : 60,
  },
  menuButton: {
    padding: 8,
  },
  logoContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 32,
    color: "#262525",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuButton: {
    padding: 8,
    backgroundColor: "transparent", // Ensure transparency
  },
  menuIcon: {
    opacity: 1, // Ensure visibility
  },
});

export default HomeScreen;
