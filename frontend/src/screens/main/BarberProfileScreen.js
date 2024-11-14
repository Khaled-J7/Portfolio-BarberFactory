import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
  Modal,
  Dimensions,
  Alert,
  Platform,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import shopService from '../../services/shopService';

const { width } = Dimensions.get('window');

/**
 * Modal component for viewing images in full screen
 */
const ImageViewerModal = ({ visible, imageUrl, onClose }) => (
  <Modal visible={visible} transparent animationType="fade">
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Feather name="x" size={24} color="#fff" />
      </TouchableOpacity>
      <Image 
        source={{ uri: imageUrl }}
        style={styles.modalImage}
        resizeMode="contain"
      />
    </View>
  </Modal>
);

/**
 * Modal component for updating shop information
 */
const UpdateInfoModal = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = async () => {
    try {
      // Basic validation
      if (!formData.name.trim() || !formData.phone.trim() || !formData.address.trim()) {
        Alert.alert('Error', 'All fields are required');
        return;
      }

      // Call parent's onSave with updated data
      await onSave(formData);
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.updateModalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Shop Information</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Barbershop Name</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={(text) => setFormData(prev => ({ ...prev, name: text }))}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phone}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.input}
                value={formData.address}
                onChangeText={(text) => setFormData(prev => ({ ...prev, address: text }))}
                placeholderTextColor="rgba(255,255,255,0.5)"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={styles.saveButton}
            onPress={handleSave}
          >
            <LinearGradient
              colors={['#2ECC71', '#27AE60']}
              style={styles.saveGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

/**
 * Main BarberProfileScreen Component
 */
const BarberProfileScreen = ({ route, navigation }) => {
  // State Management
  const [profileData, setProfileData] = useState({
    coverImage: '',
    name: '',
    phone: '',
    address: '',
    galleryImages: []
  });
  const [viewerConfig, setViewerConfig] = useState({
    visible: false,
    currentImage: null
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load shop data on mount
  useEffect(() => {
    if (route.params?.shopData) {
      // If coming from shop creation, use that data
      setProfileData(route.params.shopData);
    } else {
      // Otherwise load from API
      loadShopData();
    }
  }, []);

  /**
   * Fetch shop profile data from backend
   */
  const loadShopData = async () => {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const shopData = await shopService.getShopProfile(token);
      setProfileData(shopData);
    } catch (error) {
      console.error('Error loading shop data:', error);
      Alert.alert('Error', 'Failed to load shop profile');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle shop information updates
   */
  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const updatedShop = await shopService.updateShopProfile({
        ...profileData,
        ...updatedData
      }, token);

      setProfileData(updatedShop);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      throw error;
    }
  };

  /**
   * Handle image picking for cover and gallery
   */
  const handleImagePick = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === 'cover' ? [16, 9] : [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = result.assets[0].uri;
        
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Error', 'Authentication required');
          return;
        }

        const updateData = type === 'cover' 
          ? { ...profileData, coverImage: newImage }
          : { ...profileData, galleryImages: [...profileData.galleryImages, newImage] };

        const updatedShop = await shopService.updateShopProfile(updateData, token);
        setProfileData(updatedShop);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update image');
    }
  };

  /**
   * Handle gallery image deletion
   */
  const handleDeleteImage = async (index) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const newGalleryImages = profileData.galleryImages.filter((_, i) => i !== index);
      const updatedShop = await shopService.updateShopProfile({
        ...profileData,
        galleryImages: newGalleryImages
      }, token);

      setProfileData(updatedShop);
    } catch (error) {
      Alert.alert('Error', 'Failed to delete image');
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/BlackThemeBackgroundImage.jpg")}
      style={styles.container}
    >
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#6EC207" />
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <TouchableOpacity
          onPress={() => profileData.coverImage && setViewerConfig({
            visible: true,
            currentImage: profileData.coverImage
          })}
        >
          <View style={styles.coverContainer}>
            <Image 
              source={{ uri: profileData.coverImage }} 
              style={styles.coverImage}
            />
            <TouchableOpacity 
              style={styles.coverUploadButton}
              onPress={() => handleImagePick('cover')}
            >
              <Feather name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop Information</Text>
            <TouchableOpacity 
              style={styles.menuButton}
              onPress={() => setShowUpdateModal(true)}
            >
              <Feather name="more-vertical" size={24} color="#6EC207" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Barbershop Name</Text>
              <Text style={styles.infoValue}>{profileData.name}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{profileData.phone}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{profileData.address}</Text>
            </View>
          </View>
        </View>

        {/* Gallery Section */}
        <View style={styles.gallerySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleImagePick('gallery')}
            >
              <Feather name="plus" size={20} color="#6EC207" />
              <Text style={styles.addButtonText}>Add Photos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.galleryGrid}>
            {profileData.galleryImages.map((image, index) => (
              <View key={index} style={styles.galleryItemContainer}>
                <TouchableOpacity
                  onPress={() => setViewerConfig({
                    visible: true,
                    currentImage: image
                  })}
                >
                  <Image source={{ uri: image }} style={styles.galleryImage} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteImageButton}
                  onPress={() => handleDeleteImage(index)}
                >
                  <Feather name="trash-2" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <ImageViewerModal 
        visible={viewerConfig.visible}
        imageUrl={viewerConfig.currentImage}
        onClose={() => setViewerConfig({ visible: false, currentImage: null })}
      />

      <UpdateInfoModal
        visible={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        initialData={profileData}
        onSave={handleUpdateProfile}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  coverContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverUploadButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(110, 194, 7, 0.9)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 28,
    color: '#6EC207',
  },
  menuButton: {
    padding: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(110, 194, 7, 0.1)',
  },
  infoItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#6EC207',
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#FFFFFF',
  },

  // Gallery styles
  gallerySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(110, 194, 7, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 'auto',
  },
  addButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#6EC207',
    marginLeft: 8,
  },
  galleryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  galleryImage: {
    width: (width - 52) / 3,
    height: (width - 52) / 3,
    borderRadius: 10,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: width,
    height: width,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateModalContent: {
    width: width * 0.9,
    backgroundColor: '#262626',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#FFFFFF',
  },
  formContainer: {
    gap: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#6EC207',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 15,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Poppins-Bold',
    color: '#181C14',
    fontSize: 16,
  },
});

export default BarberProfileScreen;