// src/screens/main/CreateShopScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
  Image,
  Platform,
  Alert,
  Dimensions,
  Modal
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

// Success Modal Component
const SuccessModal = ({ visible, onClose }) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.successIcon}>
          <Feather name="check-circle" size={60} color="#6EC207" />
        </View>
        <Text style={styles.successTitle}>Congratulations!</Text>
        <Text style={styles.successMessage}>
          Your barbershop profile has been successfully created. Ready to showcase your expertise!
        </Text>
        <TouchableOpacity 
          style={styles.successButton}
          onPress={onClose}
        >
          <LinearGradient
            colors={['#2ECC71', '#27AE60']}
            style={styles.successGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.successButtonText}>Visit Your Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

