// src/screens/main/CreateShopScreen.js
import React, { useState } from "react";
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
  Modal,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import shopService from "../../services/shopService";

// Success Modal Component
const SuccessModal = ({ visible, onClose }) => (
  <Modal transparent visible={visible} animationType="fade">
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.successIcon}>
          <Feather name="check-circle" size={60} color="#6EC207" />
        </View>
        <Text style={styles.successTitle}>Congratulations!</Text>
        <Text style={styles.successMessage}>
          Your barbershop profile has been successfully created. Ready to
          showcase your expertise!
        </Text>
        <TouchableOpacity style={styles.successButton} onPress={onClose}>
          <LinearGradient
            colors={["#2ECC71", "#27AE60"]}
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
    name: "",
    phone: "",
    address: "",
    galleryImages: [],
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const pickImage = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "cover" ? [16, 9] : [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (type === "cover") {
          setFormData((prev) => ({
            ...prev,
            coverImage: result.assets[0].uri,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, result.assets[0].uri],
          }));
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed", "Camera permission is required");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: [...prev.galleryImages, result.assets[0].uri],
        }));
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
    }
  };

  const validateForm = () => {
    if (!formData.coverImage) {
      Alert.alert(
        "Missing Cover Image",
        "Please upload a cover image for your shop"
      );
      return false;
    }
    if (!formData.name || !formData.phone || !formData.address) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return false;
    }
    if (formData.galleryImages.length === 0) {
      Alert.alert(
        "Gallery Required",
        "Please add at least one image to your gallery"
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }
  
      console.log('Starting shop creation...'); // debug
      console.log('Token available:', !!token); // debug
      console.log('Form data:', formData); // debug
  
      // Create shop in backend
      const createdShop = await shopService.createShop({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        coverImage: formData.coverImage,
        galleryImages: formData.galleryImages
      }, token);
  
      console.log('Shop created successfully:', createdShop); // debug
  
      if (!createdShop) {
        throw new Error('No data received from shop creation');
      }
  
      // Update local form data with created shop data
      setFormData(createdShop);
      
      // Show success modal
      setShowSuccessModal(true);
  
    } catch (error) {
      console.error('Shop creation error:', error); // debug
      Alert.alert(
        'Error',
        error.message || 'Failed to create shop profile. Please try again.'
      );
    }
  };
  return (
    <ImageBackground
      source={require("../../assets/images/BlackThemeBackgroundImage.jpg")}
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
              onPress={() => pickImage("cover")}
            >
              <Feather
                name={formData.coverImage ? "check-circle" : "upload"}
                size={24}
                color={formData.coverImage ? "#6EC207" : "#FFFFFF"}
              />
              <Text style={styles.uploadText}>
                {formData.coverImage
                  ? "Cover Image Uploaded"
                  : "Upload Cover Image"}
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
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
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
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, phone: text }))
                }
              />
            </View>

            <View style={styles.inputContainer}>
              <Feather name="map-pin" size={20} color="#FFFFFF" />
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={formData.address}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, address: text }))
                }
              />
            </View>
          </View>

          {/* Gallery Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <View style={styles.galleryOptions}>
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={() => pickImage("gallery")}
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
                      setFormData((prev) => ({
                        ...prev,
                        galleryImages: prev.galleryImages.filter(
                          (_, i) => i !== index
                        ),
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
          <TouchableOpacity style={styles.createButton} onPress={handleSubmit}>
            <LinearGradient
              colors={["#2ECC71", "#27AE60"]}
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
  onClose={async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      // Get the latest shop data from backend
      const shopData = await shopService.getShopProfile(token);
      console.log('Retrieved shop data before navigation:', shopData); // debug

      setShowSuccessModal(false);
      navigation.replace('BarberProfile', { shopData });
    } catch (error) {
      console.error('Navigation error:', error); // debug
      Alert.alert('Error', 'Failed to load shop profile');
      // Navigate anyway with local data as fallback
      navigation.replace('BarberProfile', {
        shopData: {
          coverImage: formData.coverImage,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          galleryImages: formData.galleryImages,
        },
      });
    }
  }}
/>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: "#6EC207",
    fontSize: 28,
    fontFamily: "BebasNeue-Regular",
    marginBottom: 15,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderStyle: "dashed",
  },
  uploadText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 10,
    padding: Platform.OS === "ios" ? 0 : 5,
  },
  galleryOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  galleryButton: {
    flex: 0.48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  galleryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 8,
  },
  gallery: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 15,
  },
  galleryItem: {
    width: (Dimensions.get("window").width - 60) / 3,
    height: (Dimensions.get("window").width - 60) / 3,
    borderRadius: 10,
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  deleteButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: "#FFFFFF",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  createButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginVertical: 20,
  },
  gradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  createButtonText: {
    color: "#181C14",
    fontSize: 22,
    fontFamily: "BebasNeue-Regular",
  },
  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#262626",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "85%",
    maxWidth: 340,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    fontFamily: "BebasNeue-Regular",
    marginBottom: 15,
  },
  successMessage: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 24,
  },
  successButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
  },
  successGradient: {
    paddingVertical: 15,
    alignItems: "center",
  },
  successButtonText: {
    color: "#181C14",
    fontSize: 20,
    fontFamily: "BebasNeue-Regular",
  },
});
