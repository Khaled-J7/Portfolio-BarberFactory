// src/screens/main/BarberProfileScreen.js
import React, { useState, useEffect } from "react";
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
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomNavigationBar from "../../components/navigation/BottomNavigationBar";

const { width } = Dimensions.get("window");

// Modal Components
const ImageViewerModal = ({
  visible,
  imageUrl,
  onClose,
  onNext,
  onPrev,
  isLast,
  isFirst,
}) => (
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

      {!isFirst && onPrev && (
        <TouchableOpacity
          style={[styles.navButton, styles.leftButton]}
          onPress={onPrev}
        >
          <Feather name="chevron-left" size={30} color="#fff" />
        </TouchableOpacity>
      )}

      {!isLast && onNext && (
        <TouchableOpacity
          style={[styles.navButton, styles.rightButton]}
          onPress={onNext}
        >
          <Feather name="chevron-right" size={30} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  </Modal>
);

const OptionsModal = ({ visible, onClose, onDelete }) => (
  <Modal transparent visible={visible} onRequestClose={onClose}>
    <TouchableOpacity
      style={styles.optionsOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionItem}
          onPress={() => {
            onDelete();
            onClose();
          }}
        >
          <Feather name="trash-2" size={20} color="#FF3B30" />
          <Text style={styles.optionText}>Delete Image</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  </Modal>
);

const BarberProfileScreen = ({ route, navigation }) => {
  // States for profile data and UI
  const [profileData, setProfileData] = useState({
    coverImage: "",
    name: "",
    phone: "",
    address: "",
    galleryImages: [],
  });
  const [viewerConfig, setViewerConfig] = useState({
    visible: false,
    currentImage: null,
    currentIndex: 0,
  });
  const [showOptions, setShowOptions] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  // Load profile data from CreateShopScreen
  useEffect(() => {
    if (route.params?.shopData) {
      setProfileData(route.params.shopData);
    }
  }, [route.params]);

  // Image handling functions
  const handleImagePick = async (type) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: type === "cover" ? [16, 9] : [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        if (type === "cover") {
          setProfileData((prev) => ({
            ...prev,
            coverImage: result.assets[0].uri,
          }));
        } else {
          setProfileData((prev) => ({
            ...prev,
            galleryImages: [...prev.galleryImages, result.assets[0].uri],
          }));
        }
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
    }
  };

  const handleDeleteImage = (index) => {
    Alert.alert("Delete Image", "Are you sure you want to delete this image?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => {
          setProfileData((prev) => ({
            ...prev,
            galleryImages: prev.galleryImages.filter((_, i) => i !== index),
          }));
        },
        style: "destructive",
      },
    ]);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/backgroundImageForm.jpeg")}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Image */}
        <TouchableOpacity
          onPress={() =>
            profileData.coverImage &&
            setViewerConfig({
              visible: true,
              currentImage: profileData.coverImage,
              currentIndex: -1,
            })
          }
        >
          <View style={styles.coverContainer}>
            <Image
              source={{ uri: profileData.coverImage }}
              style={styles.coverImage}
            />
            <TouchableOpacity
              style={styles.coverUploadButton}
              onPress={() => handleImagePick("cover")}
            >
              <Feather name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Barbershop Name</Text>
              <Text style={styles.infoValue}>{profileData.name}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={20} color="#6EC207" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{profileData.phone}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={20} color="#6EC207" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              <Text style={styles.infoValue}>{profileData.address}</Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Feather name="edit-2" size={20} color="#6EC207" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Gallery */}
        <View style={styles.gallerySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Gallery</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleImagePick("gallery")}
            >
              <Feather name="plus" size={20} color="#6EC207" />
              <Text style={styles.addButtonText}>Add Photos</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.galleryGrid}>
            {profileData.galleryImages.map((image, index) => (
              <View key={index} style={styles.galleryItem}>
                <TouchableOpacity
                  onPress={() =>
                    setViewerConfig({
                      visible: true,
                      currentImage: image,
                      currentIndex: index,
                    })
                  }
                >
                  <Image source={{ uri: image }} style={styles.galleryImage} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.optionsButton}
                  onPress={() => {
                    setSelectedImageIndex(index);
                    setShowOptions(true);
                  }}
                >
                  <Feather name="more-vertical" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <BottomNavigationBar navigation={navigation} />

      {/* Modals */}
      <ImageViewerModal
        {...viewerConfig}
        onClose={() => setViewerConfig({ visible: false, currentImage: null })}
        onNext={
          viewerConfig.currentIndex < profileData.galleryImages.length - 1
            ? () =>
                setViewerConfig((prev) => ({
                  ...prev,
                  currentImage:
                    profileData.galleryImages[prev.currentIndex + 1],
                  currentIndex: prev.currentIndex + 1,
                }))
            : null
        }
        onPrev={
          viewerConfig.currentIndex > 0
            ? () =>
                setViewerConfig((prev) => ({
                  ...prev,
                  currentImage:
                    profileData.galleryImages[prev.currentIndex - 1],
                  currentIndex: prev.currentIndex - 1,
                }))
            : null
        }
        isLast={
          viewerConfig.currentIndex === profileData.galleryImages.length - 1
        }
        isFirst={viewerConfig.currentIndex === 0}
      />

      <OptionsModal
        visible={showOptions}
        onClose={() => setShowOptions(false)}
        onDelete={() => {
          handleDeleteImage(selectedImageIndex);
          setSelectedImageIndex(null);
        }}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  // Cover Section
  coverContainer: {
    height: 200,
    width: "100%",
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
  },
  coverUploadButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(110, 194, 7, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
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

  // Profile Section
  profileSection: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  infoContent: {
    flex: 1,
    marginRight: 15,
  },
  infoLabel: {
    fontFamily: "Poppins-Bold",
    fontSize: 14,
    color: "#6EC207",
    marginBottom: 4,
  },
  infoValue: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#FFFFFF",
  },
  editButton: {
    padding: 5,
  },

  // Gallery Section
  gallerySection: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontFamily: "BebasNeue-Regular",
    fontSize: 28,
    color: "#6EC207",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(110, 194, 7, 0.1)",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  addButtonText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#6EC207",
    marginLeft: 8,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  galleryItem: {
    width: (width - 52) / 3,
    height: (width - 52) / 3,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
  },
  optionsButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  // Modals
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: width,
    height: width,
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  navButton: {
    position: "absolute",
    top: "50%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    transform: [{ translateY: -25 }],
  },
  leftButton: {
    left: 20,
  },
  rightButton: {
    right: 20,
  },
  optionsOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionsContainer: {
    backgroundColor: "#262626",
    borderRadius: 15,
    width: "70%",
    overflow: "hidden",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  optionText: {
    fontFamily: "Poppins-Regular",
    fontSize: 16,
    color: "#FF3B30",
    marginLeft: 12,
  },
});
export default BarberProfileScreen;
