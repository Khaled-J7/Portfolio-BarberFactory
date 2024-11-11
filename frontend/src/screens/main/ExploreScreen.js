import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import MapView from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

const ExploreScreen = () => {
  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [region, setRegion] = useState({
    latitude: 36.8065,  // Tunisia default
    longitude: 10.1815,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef(null);
  const searchTimeout = useRef(null);

  // Search places using Nominatim
  const searchPlaces = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&limit=5`
      );
      const data = await response.json();
      
      const formattedResults = data.map(item => ({
        id: item.place_id,
        name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon)
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search input changes
  const handleSearchChange = (text) => {
    setSearchQuery(text);
    
    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Set new timeout for search
    searchTimeout.current = setTimeout(() => {
      searchPlaces(text);
    }, 500);
  };

  // Handle location selection
  const handleLocationSelect = (location) => {
    const newRegion = {
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };

    setRegion(newRegion);
    setSearchQuery(location.name);
    setSearchResults([]);

    // Animate to new location
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, 1000);
    }
  };

  const MapComponent = () => (
    <MapView
      ref={mapRef}
      style={isFullScreen ? styles.fullScreenMap : styles.map}
      initialRegion={region}
      region={region}
      onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
    />
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <Text style={styles.title}>Explore</Text>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search any location"
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={handleSearchChange}
        />
        {isLoading ? (
          <ActivityIndicator style={styles.searchIcon} color="#2ECC71" />
        ) : (
          <Feather 
            name="search" 
            size={20} 
            color="#2ECC71" 
            style={styles.searchIcon}
          />
        )}
      </View>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={searchResults}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleLocationSelect(item)}
              >
                <Feather name="map-pin" size={16} color="#666" />
                <Text style={styles.resultText} numberOfLines={2}>
                  {item.name}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Map Container */}
      <View style={styles.mapContainer}>
        <MapComponent />
        <TouchableOpacity 
          style={styles.fullScreenButton}
          onPress={() => setIsFullScreen(true)}
        >
          <Feather name="maximize" size={20} color="#2ECC71" />
        </TouchableOpacity>
      </View>

      {/* Full Screen Map Modal */}
      <Modal
        visible={isFullScreen}
        animationType="slide"
      >
        <View style={styles.fullScreenContainer}>
          <MapComponent />
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => setIsFullScreen(false)}
          >
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 65, // Added to account for tab bar
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: '#262525',
    marginBottom: 20,
  },
  searchContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  searchInput: {
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingRight: 50,
    fontSize: 16,
    color: '#262525',
    fontFamily: 'Poppins-Regular',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  searchIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  resultsContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    maxHeight: 200,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  resultText: {
    marginLeft: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#262525',
    flex: 1,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 20, // Added space before tab bar
  },
  map: {
    flex: 1,
    borderRadius: 20,
  },
  fullScreenMap: {
    ...StyleSheet.absoluteFillObject,
  },
  fullScreenButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullScreenContainer: {
    flex: 1,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ExploreScreen;