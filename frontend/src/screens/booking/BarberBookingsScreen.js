import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bookingService from '../../services/bookingService';

/**
 * Booking Card Component
 * Displays individual booking information
 */
const BookingCard = ({ booking, isShopBooking = false, onStatusUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  // Format date and time for display
  const formattedDate = bookingService.formatDate(booking.date);
  const formattedTime = bookingService.formatTime(booking.time);

  /**
   * Handle status update (confirm/decline)
   */
  const handleStatusUpdate = async (status) => {
    try {
      await onStatusUpdate(booking._id, status);
      setExpanded(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F8F8']}
      style={styles.cardContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardContent}>
        {/* Main Booking Info */}
        <View style={styles.bookingInfo}>
          <Text style={styles.name}>
            {isShopBooking ? booking.clientName : booking.shopName}
          </Text>
          <View style={styles.timeInfo}>
            <Feather name="calendar" size={16} color="#262525" />
            <Text style={styles.dateTimeText}>
              {formattedDate} - {formattedTime}
            </Text>
          </View>
        </View>

        {/* Status Section */}
        {isShopBooking && booking.status === 'PENDING' ? (
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setExpanded(!expanded)}
          >
            <Feather
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#262525"
            />
          </TouchableOpacity>
        ) : (
          <View style={[
            styles.statusBadge,
            booking.status === 'CONFIRMED' ? styles.confirmedBadge : styles.declinedBadge
          ]}>
            <Text style={styles.statusText}>
              {booking.status === 'CONFIRMED' ? 'CONFIRMED ✓' : 'DECLINED ✗'}
            </Text>
          </View>
        )}
      </View>

      {/* Expanded Actions Section */}
      {isShopBooking && expanded && booking.status === 'PENDING' && (
        <View style={styles.expandedContent}>
          <TouchableOpacity
            style={[styles.actionButton, styles.confirmButton]}
            onPress={() => handleStatusUpdate('CONFIRMED')}
          >
            <Text style={styles.actionButtonText}>Confirm</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleStatusUpdate('DECLINED')}
          >
            <Text style={styles.actionButtonText}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

/**
 * Main BarberBookingsScreen Component
 */
const BarberBookingsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [shopBookings, setShopBookings] = useState([]);
  const [personalBookings, setPersonalBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('shop'); // 'shop' or 'personal'

  useEffect(() => {
    loadBookings();
  }, []);

  /**
   * Load all bookings (both shop and personal)
   */
  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await bookingService.getBookings(token);
      setShopBookings(response.shopBookings);
      setPersonalBookings(response.myBookings);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookings');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle booking status update
   */
  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await bookingService.updateBookingStatus({
        bookingId,
        status
      }, token);
      
      // Refresh bookings after update
      loadBookings();
      Alert.alert('Success', Booking `${status.toLowerCase()}` ,successfully);//i modifi this line !!!
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <Text style={styles.headerTitle}>Bookings</Text>

      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'shop' && styles.activeTabButton]}
          onPress={() => setActiveTab('shop')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'shop' && styles.activeTabButtonText
          ]}>
            Shop Bookings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'personal' && styles.activeTabButton]}
          onPress={() => setActiveTab('personal')}
        >
          <Text style={[
            styles.tabButtonText,
            activeTab === 'personal' && styles.activeTabButtonText
          ]}>
            My Bookings
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'shop' ? (
          shopBookings.length > 0 ? (
            shopBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isShopBooking={true}
                onStatusUpdate={handleStatusUpdate}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No shop bookings yet</Text>
          )
        ) : (
          personalBookings.length > 0 ? (
            personalBookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                isShopBooking={false}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No personal bookings yet</Text>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
  },
  headerTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: '#262525',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#2ECC71',
  },
  tabButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#262525',
  },
  activeTabButtonText: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
  },
  cardContainer: {
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  bookingInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#262525',
    marginBottom: 5,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimeText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
  },
  expandButton: {
    padding: 5,
  },
  expandedContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#2ECC71',
  },
  declineButton: {
    backgroundColor: '#FF3B30',
  },
  actionButtonText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  statusBadge: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  confirmedBadge: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  declinedBadge: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  statusText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  },
  emptyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BarberBookingsScreen;