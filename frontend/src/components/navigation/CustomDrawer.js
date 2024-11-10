// src/components/navigation/CustomDrawer.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.75;

const CustomDrawer = ({ isVisible, onClose, navigation }) => {
  if (!isVisible) return null;

  // Log Out Function 
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      onClose();
      navigation.replace('LoginSignup');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const menuItems = [
    { 
      icon: 'settings', 
      label: 'Settings',
      onPress: () => {
        onClose();
        navigation.navigate('Settings');
      }
    },
    { 
      icon: 'info', 
      label: 'About Us',
      onPress: () => {
        onClose();
        console.log('About Us pressed');
        navigation.navigate('About'); 
      }
    },
    { 
      icon: 'log-out', 
      label: 'Log Out',
      onPress: handleLogout
    }
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.overlayBackground} />
      </TouchableOpacity>
      
      <View style={styles.drawer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.menuItem,
              index === menuItems.length - 1 && styles.lastMenuItem
            ]}
            onPress={item.onPress}
          >
            <View style={styles.menuItemContent}>
              <Feather name={item.icon} size={24} color="#262525" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>
            Version {Constants.expoConfig?.version || '1.0.0'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: '#C0EBA6',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
  },
  menuItem: {
    marginBottom: 15,
    paddingVertical: 12,
  },
  lastMenuItem: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
    paddingTop: 20,
    marginTop: 10,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 15,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#262525',
  },
  versionContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#262525',
  },
});

export default CustomDrawer;