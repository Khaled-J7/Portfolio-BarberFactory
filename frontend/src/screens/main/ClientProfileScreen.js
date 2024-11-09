import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Alert,
  Modal,
  ActivityIndicator,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import clientService from '../../services/clientService';

/**
 * UpdateInfoModal Component
 * Modal for updating client information
 */
const UpdateInfoModal = ({ visible, onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState(initialData);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleSave = async () => {
    try {
      if (!formData.fullName.trim() || !formData.phoneNumber.trim()) {
        Alert.alert('Error', 'All fields are required');
        return;
      }
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
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Update Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(text) => setFormData(prev => ({ ...prev, fullName: text }))}
                placeholderTextColor="#666"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNumber: text }))}
                keyboardType="phone-pad"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

/**
 * ClientProfileScreen Component
 * Main client profile screen displaying user information
 */
const ClientProfileScreen = ({ navigation }) => {
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullName: '',
    phoneNumber: '',
    profileImage: null,
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [backgroundLoaded, setBackgroundLoaded] = useState(false);

  // Load profile data on mount
  useEffect(() => {
    loadProfile();
  }, []);

  /**
   * Load client profile data
   */
  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const data = await clientService.getProfile(token);
      setProfileData({
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        profileImage: data.profileImage || require('../../assets/images/defaultProfileImage.jpg')
      });
    } catch (error) {
      console.error('Load profile error:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle profile image selection
   */
  const handleImagePick = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const token = await AsyncStorage.getItem('userToken');
        const updatedProfile = await clientService.updateProfile({
          ...profileData,
          profileImage: result.assets[0].uri
        }, token);

        setProfileData(prev => ({
          ...prev,
          profileImage: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile image');
    }
  };

  /**
   * Handle profile information update
   */
  const handleUpdateProfile = async (updatedData) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const updated = await clientService.updateProfile(updatedData, token);
      setProfileData(prev => ({
        ...prev,
        fullName: updated.fullName,
        phoneNumber: updated.phoneNumber
      }));
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
      throw error;
    }
  };

  // Show loading indicator while loading profile
  if (isLoading || !backgroundLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../../assets/images/backgroundBeigeThemeImage.jpg')}
      style={styles.container}
      onLoad={() => setBackgroundLoaded(true)}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Image Section */}
        <View style={styles.profileImageSection}>
          <View style={styles.imageContainer}>
            <Image
              source={
                profileData.profileImage
                  ? { uri: profileData.profileImage }
                  : require('../../assets/images/defaultProfileImage.jpg')
              }
              style={styles.profileImage}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
            />
            {imageLoading && (
              <View style={styles.imageLoadingOverlay}>
                <ActivityIndicator color="#000000" />
              </View>
            )}
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={handleImagePick}
            >
              <Feather name="camera" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Information Section */}
        <View style={styles.infoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => setShowUpdateModal(true)}
            >
              <Feather name="more-vertical" size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{profileData.fullName}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone Number</Text>
            <Text style={styles.infoValue}>{profileData.phoneNumber}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>Client</Text>
          </View>
        </View>
      </ScrollView>

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC', // Beige color for loading screen
  },
  profileImageSection: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#000000',
  },
  imageLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(245, 245, 220, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75,
  },
  changePhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#000000',
  },
  infoSection: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
    color: '#000000',
  },
  editButton: {
    padding: 5,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  infoValue: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#000000',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
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
    color: '#000000',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
    padding: 15,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ClientProfileScreen;