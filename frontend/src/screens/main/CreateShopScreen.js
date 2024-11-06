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

export default function CreateShopScreen({ navigation }) {
  const [formData, setFormData] = useState({
    coverImage: null,
    name: '',
    phone: '',
    address: '',
    galleryImages: []
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'cover' ? [16, 9] : [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (type === 'cover') {
          setFormData(prev => ({
            ...prev,
            coverImage: result.assets[0].uri
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            galleryImages: [...prev.galleryImages, result.assets[0].uri]
          }));
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData(prev => ({
          ...prev,
          galleryImages: [...prev.galleryImages, result.assets[0].uri]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const validateForm = () => {
    if (!formData.coverImage) {
      Alert.alert('Missing Cover Image', 'Please upload a cover image for your shop');
      return false;
    }
    if (!formData.name || !formData.phone || !formData.address) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return false;
    }
    if (formData.galleryImages.length === 0) {
      Alert.alert('Gallery Required', 'Please add at least one image to your gallery');
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    setShowSuccessModal(true);
  };

  return (
    <ImageBackground
      source={require('../../assets/images/backgroundImageForm.png')}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Cover Image Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cover Image</Text>
            <TouchableOpacity 
              style={styles.uploadButton}
              onPress={() => pickImage('cover')}
            >
              <Feather 
                name={formData.coverImage ? "check-circle" : "upload"} 
                size={24} 
                color={formData.coverImage ? "#6EC207" : "#FFFFFF"} 
              />
              <Text style={styles.uploadText}>
                {formData.coverImage ? 'Cover Image Uploaded' : 'Upload Cover Image'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Shop Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shop Information</Text>
            <View style={styles.inputContainer}>
              <Feather name="shopping-bag" size={20} color="#FFFFFF" />
              <TextInput
                style={styles.input}
                placeholder="Barbershop Name"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="phone" size={20} color="#FFFFFF" />
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="rgba(255,255,255,0.6)"
                keyboardType="phone-pad"
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="map-pin" size={20} color="#FFFFFF" />
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
              />
            </View>
          </View>

          {/* Gallery Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <View style={styles.galleryOptions}>
              <TouchableOpacity 
                style={styles.galleryButton}
                onPress={() => pickImage('gallery')}
              >
                <Feather name="folder" size={24} color="#FFFFFF" />
                <Text style={styles.galleryButtonText}>Choose from Device</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.galleryButton}
                onPress={takePhoto}
              >
                <Feather name="camera" size={24} color="#FFFFFF" />
                <Text style={styles.galleryButtonText}>Take Photo</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.gallery}>
              {formData.galleryImages.map((image, index) => (
                <View key={index} style={styles.galleryItem}>
                  <Image source={{ uri: image }} style={styles.galleryImage} />
                  <TouchableOpacity 
                    style={styles.deleteButton}
                    onPress={() => {
                      setFormData(prev => ({
                        ...prev,
                        galleryImages: prev.galleryImages.filter((_, i) => i !== index)
                      }));
                    }}
                  >
                    <Feather name="x" size={20} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          {/* Create Profile Button */}
          <TouchableOpacity 
            style={styles.createButton}
            onPress={handleSubmit}
          >
            <LinearGradient
              colors={['#2ECC71', '#27AE60']}
              style={styles.gradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.createButtonText}>Create Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <SuccessModal 
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          // Will navigate to BarberProfile screen when implemented
          console.log('Navigate to profile');
        }}
      />
    </ImageBackground>
  );
}