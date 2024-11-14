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
 * Displays individual booking information with status
 */
const BookingCard = ({ booking }) => {
  // Format date and time
  const formattedDate = bookingService.formatDate(booking.date);
  const formattedTime = bookingService.formatTime(booking.time);

  // Get status styling
  const getStatusStyle = () => {
    switch(booking.status) {
      case 'CONFIRMED':
        return {
          container: styles.confirmedStatus,
          text: styles.confirmedText,
          icon: '✓'
        };
      case 'DECLINED':
        return {
          container: styles.declinedStatus,
          text: styles.declinedText,
          icon: '✗'
        };
      default:
        return {
          container: styles.pendingStatus,
          text: styles.pendingText,
          icon: '⋯'
        };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <LinearGradient
      colors={['#FFFFFF', '#F8F8F8']}
      style={styles.cardContainer}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Shop Name */}
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
      <View style={[styles.statusBadge, statusStyle.container]}>
        <Text style={[styles.statusText, statusStyle.text]}>
          {booking.status} {statusStyle.icon}
        </Text>
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

  const loadBookings = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const fetchedBookings = await bookingService.getBookings(token);
      setBookings(fetchedBookings);
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
      {bookings.length > 0 ? (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="calendar" size={50} color="#C0C0C0" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubText}>
            Your appointments will appear here after booking
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
    padding: 15,
    borderWidth: 1,
    borderColor: '#E5E5E5',
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
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginTop: 5,
  },
  confirmedStatus: {
    backgroundColor: 'rgba(46, 204, 113, 0.1)',
  },
  declinedStatus: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
  },
  pendingStatus: {
    backgroundColor: 'rgba(241, 196, 15, 0.1)',
  },
  statusText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
  },
  confirmedText: {
    color: '#2ECC71',
  },
  declinedText: {
    color: '#FF3B30',
  },
  pendingText: {
    color: '#F1C40F',
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

export default ClientBookingsScreen;