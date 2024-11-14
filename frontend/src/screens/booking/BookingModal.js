import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Alert,
    ActivityIndicator,
    Platform,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'react-native-calendars';
import { Feather } from '@expo/vector-icons';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';
import bookingService from '../../services/bookingService';

const { width } = Dimensions.get('window');

const BookingModal = ({ visible, onClose, shopData }) => {
    // States
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [loading, setLoading] = useState(false);

    // Available time slots (9 AM to 5 PM)
    const timeSlots = [
        '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00'
    ];

    // Get tomorrow's date as minimum selectable date
    const minDate = moment().add(1, 'days').format('YYYY-MM-DD');
    // Get date 30 days from now as maximum selectable date
    const maxDate = moment().add(30, 'days').format('YYYY-MM-DD');

    /**
     * Handle date selection
     */
    const handleDateSelect = (date) => {
        setSelectedDate(date.dateString);
        setSelectedTime('');
    };

    /**
     * Handle time slot selection
     */
    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    /**
     * Handle booking submission
     */
    const handleBooking = async () => {
        if (!selectedDate || !selectedTime) {
            Alert.alert('Error', 'Please select both date and time');
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            
            if (!token) {
                Alert.alert('Error', 'Please login to book an appointment');
                return;
            }

            await bookingService.createBooking({
                shopId: shopData._id,
                date: selectedDate,
                time: selectedTime
            }, token);

            Alert.alert(
                'Success',
                'Booking request sent successfully!',
                [{ text: 'OK', onPress: onClose }]
            );
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to create booking');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Book Appointment</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Feather name="x" size={24} color="#262525" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Shop Info */}
                        <Text style={styles.shopName}>{shopData?.name}</Text>

                        {/* Calendar */}
                        <Text style={styles.sectionTitle}>Select Date</Text>
                        <Calendar
                            onDayPress={handleDateSelect}
                            minDate={minDate}
                            maxDate={maxDate}
                            markedDates={{
                                [selectedDate]: {
                                    selected: true,
                                    selectedColor: '#2ECC71'
                                }
                            }}
                            theme={{
                                calendarBackground: '#FFFFFF',
                                textSectionTitleColor: '#262525',
                                selectedDayBackgroundColor: '#2ECC71',
                                selectedDayTextColor: '#FFFFFF',
                                todayTextColor: '#2ECC71',
                                dayTextColor: '#262525',
                                textDisabledColor: '#C0C0C0',
                                arrowColor: '#2ECC71',
                                monthTextColor: '#262525',
                                textMonthFontFamily: 'Poppins-Bold',
                                textDayFontFamily: 'Poppins-Regular',
                                textDayHeaderFontFamily: 'Poppins-Bold'
                            }}
                        />

                        {/* Time Slots */}
                        {selectedDate && (
                            <>
                                <Text style={styles.sectionTitle}>Select Time</Text>
                                <View style={styles.timeGrid}>
                                    {timeSlots.map((time) => (
                                        <TouchableOpacity
                                            key={time}
                                            style={[
                                                styles.timeSlot,
                                                selectedTime === time && styles.selectedTimeSlot
                                            ]}
                                            onPress={() => handleTimeSelect(time)}
                                        >
                                            <Text
                                                style={[
                                                    styles.timeText,
                                                    selectedTime === time && styles.selectedTimeText
                                                ]}
                                            >
                                                {moment(time, 'HH:mm').format('h:mm A')}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* Book Button */}
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={handleBooking}
                            disabled={loading || !selectedDate || !selectedTime}
                        >
                            <LinearGradient
                                colors={['#2ECC71', '#27AE60']}
                                style={styles.gradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                            >
                                {loading ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Text style={styles.buttonText}>Book Appointment</Text>
                                        <Feather name="arrow-right" size={20} color="#FFFFFF" />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5E5',
    },
    title: {
        fontFamily: 'BebasNeue-Regular',
        fontSize: 28,
        color: '#262525',
    },
    shopName: {
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#005B41',
        marginVertical: 15,
    },
    sectionTitle: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#262525',
        marginTop: 20,
        marginBottom: 10,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 10,
    },
    timeSlot: {
        width: (width - 60) / 3,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    selectedTimeSlot: {
        borderColor: '#2ECC71',
        backgroundColor: '#2ECC71',
    },
    timeText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: '#262525',
    },
    selectedTimeText: {
        color: '#FFFFFF',
    },
    bookButton: {
        marginTop: 30,
        borderRadius: 25,
        overflow: 'hidden',
    },
    gradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        gap: 10,
    },
    buttonText: {
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: '#FFFFFF',
    },
});

export default BookingModal;