// src/screens/main/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavigationBar from '../../components/navigation/BottomNavigationBar';
import CustomDrawer from '../../components/navigation/CustomDrawer';
import BarbershopCard from '../../components/ui/BarbershopCard';

// Debug
console.log("This is HomeScreen Debug test");

const HomeScreen = ({ navigation }) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [userType, setUserType] = useState('client');
  const [barbershops, setBarbershops] = useState([]);

  useEffect(() => {
    const getUserType = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { isBarber } = JSON.parse(userData);
          setUserType(isBarber ? 'barber' : 'client');
        }
      } catch (error) {
        console.error('Error fetching user type:', error);
      }
    };
    getUserType();
  }, []);

  const handleBookPress = (shopId) => {
    // Will be implemented when we create the booking system
    console.log('Booking pressed for shop:', shopId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => setIsDrawerVisible(true)}
        >
          <Feather name="list" size={24} color="#262525" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Feather name="home" size={24} color="#262525" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/appLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Discover nearby Barbershops</Text>

      {/* Barbershops List */}
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {barbershops.length > 0 ? (
          barbershops.map((shop) => (
            <BarbershopCard
              key={shop.id}
              shopName={shop.name}
              address={shop.address}
              phone={shop.phone}
              imageUrl={shop.imageUrl}
              onBookPress={() => handleBookPress(shop.id)}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No barbershops available yet.
            </Text>
          </View>
        )}
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
    backgroundColor: '#FFFFFF',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    height: Platform.OS === 'ios' ? 90 : 60,
  },
  iconButton: {
    padding: 10,
    backgroundColor: '#F8F8F8', // Light background for visibility
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: '#262525',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});

export default HomeScreen;