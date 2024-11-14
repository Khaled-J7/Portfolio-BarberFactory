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
 * BookingCard Component
 * Displays individual booking information with actions
 */
const BookingCard = ({ booking, onStatusUpdate }) => {
  const [expanded, setExpanded] = useState(false);

  // Format date and time
  const formattedDate = bookingService.formatDate(booking.date);
  const formattedTime = bookingService.formatTime(booking.time);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F8F8']}
      style={styles.cardContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.cardContent}>
        {/* Client Info */}
        <View style={styles.infoSection}>
          <Text style={styles.clientName}>{booking.clientName}</Text>
          <View style={styles.timeInfo}>
            <Feather name="calendar" size={16} color="#262525" />
            <Text style={styles.dateTimeText}>
              {formattedDate} - {formattedTime}
            </Text>
          </View>
        </View>

        {/* Status Section */}
        {booking.status === 'PENDING' ? (
          <TouchableOpacity
            style={styles.actionButton}
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
              {booking.status === 'CONFIRMED' ? 'Confirmed ✓' : 'Declined ✗'}
            </Text>
          </View>
        )}
      </View>

      {/* Expanded Actions */}
      {expanded && booking.status === 'PENDING' && (
        <View style={styles.expandedActions}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.confirmBtn]}
            onPress={() => onStatusUpdate(booking._id, 'CONFIRMED')}
          >
            <Text style={styles.actionBtnText}>Confirm</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionBtn, styles.declineBtn]}
            onPress={() => onStatusUpdate(booking._id, 'DECLINED')}
          >
            <Text style={styles.actionBtnText}>Decline</Text>
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
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        setError('Authentication required');
        return;
      }

      const fetchedBookings = await bookingService.getBookings(token);
      setBookings(fetchedBookings);
    } catch (error) {
      setError(error.message || 'Failed to load bookings');
      Alert.alert('Error', error.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, status) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await bookingService.updateBookingStatus({
        bookingId,
        status
      }, token);
      
      // Refresh bookings after update
      loadBookings();
      Alert.alert('Success', `Booking ${status.toLowerCase()} successfully`);
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to update booking status');
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

      {/* Bookings List */}
      {bookings.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={50} color="#C0C0C0" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubText}>
            Your shop's booking requests will appear here
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight + 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 32,
    color: '#262525',
    paddingHorizontal: 20,
    marginBottom: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoSection: {
    flex: 1,
  },
  clientName: {
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
  actionButton: {
    padding: 5,
  },
  expandedActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmBtn: {
    backgroundColor: '#2ECC71',
  },
  declineBtn: {
    backgroundColor: '#FF3B30',
  },
  actionBtnText: {
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
    color: '#262525',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    color: '#262525',
    marginTop: 15,
  },
  emptySubText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default BarberBookingsScreen;