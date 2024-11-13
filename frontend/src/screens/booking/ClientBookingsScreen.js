import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
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
const BookingCard = ({ booking }) => {
  // Format date and time for display
  const formattedDate = bookingService.formatDate(booking.date);
  const formattedTime = bookingService.formatTime(booking.time);

  // Determine status styles
  const isConfirmed = booking.status === 'CONFIRMED';
  const statusColor = isConfirmed ? '#2ECC71' : '#FF3B30';
  const statusIcon = isConfirmed ? '✓' : '✗';

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F8F8']}
      style={styles.cardContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardContent}>
        {/* Shop Info */}
        <Text style={styles.shopName}>{booking.shopName}</Text>

        {/* Date & Time */}
        <View style={styles.infoRow}>
          <Feather name="calendar" size={16} color="#262525" />
          <Text style={styles.infoText}>{formattedDate}</Text>
        </View>
        <View style={styles.infoRow}>
          <Feather name="clock" size={16} color="#262525" />
          <Text style={styles.infoText}>{formattedTime}</Text>
        </View>

        {/* Status Badge */}
        <View style={[
          styles.statusContainer,
          { backgroundColor: `${statusColor}10` }
        ]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {booking.status} {statusIcon}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

/**
 * Main ClientBookingsScreen Component
 */
const ClientBookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  /**
   * Load all bookings for the client
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
      setBookings(response.myBookings);
    } catch (error) {
      Alert.alert('Error', 'Failed to load bookings');
      console.error(error);
    } finally {
      setLoading(false);
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
      <Text style={styles.headerTitle}>My Bookings</Text>

      {/* Bookings List */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Feather name="calendar" size={50} color="#C0C0C0" />
            <Text style={styles.emptyText}>No bookings yet</Text>
            <Text style={styles.emptySubtext}>
              Your upcoming appointments will appear here
            </Text>
          </View>
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
    padding: 15,
  },
  shopName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#005B41',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#262525',
  },
  statusContainer: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 5,
  },
  statusText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#262525',
    marginTop: 15,
    marginBottom: 5,
  },
  emptySubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});

export default ClientBookingsScreen;