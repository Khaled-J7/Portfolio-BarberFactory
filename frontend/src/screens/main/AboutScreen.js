import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AboutScreen = ({ navigation }) => {
  const currentYear = new Date().getFullYear();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#2ECC71', '#27AE60']}
          style={styles.headerGradient}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>

          <Image
            source={require('../../assets/images/appLogo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>About BarberFactory</Text>
        </LinearGradient>

        {/* Content Sections */}
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Mission</Text>
            <Text style={styles.text}>
              BarberFactory is designed to revolutionize the barbershop experience.
              We connect skilled barbers with clients seeking top-notch grooming
              services, making booking and managing appointments effortless for
              everyone involved.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For Barbershops</Text>
            <View style={styles.featureItem}>
              <Feather name="home" size={24} color="#2ECC71" />
              <Text style={styles.featureText}>Create your unique shop profile</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="calendar" size={24} color="#2ECC71" />
              <Text style={styles.featureText}>Manage appointments with ease</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="image" size={24} color="#2ECC71" />
              <Text style={styles.featureText}>Showcase your best work</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="star" size={24} color="#2ECC71" />
              <Text style={styles.featureText}>Build your reputation with reviews</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>For Clients</Text>
            <View style={styles.featureItem}>
              <Feather name="search" size={24} color="#2ECC71" />
              <Text style={styles.featureText}>Discover top-rated barbershops nearby</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="book" size={24} color="#2ECC71" />
              <Text style={styles.featureText}>Book appointments with a few taps</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="scissors" size={24} color="#2ECC71" />
              <Text style={styles.featureText}>Browse styles and services</Text>
            </View>
            <View style={styles.featureItem}>
              <Feather name="message-circle" size={24} color="#2ECC71" />
              <Text style={styles.featureText}>Communicate directly with your barber</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>How It Works</Text>
            <Text style={styles.text}>
              1. Create an account as a barbershop owner or client.{'\n'}
              2. Barbershops: Set up your profile, add services, and manage availability.{'\n'}
              3. Clients: Browse nearby barbershops, view portfolios, and book appointments.{'\n'}
              4. Enjoy a seamless, professional grooming experience!
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Join the BarberFactory Community</Text>
            <Text style={styles.text}>
              Whether you're a skilled barber looking to grow your business or a
              client seeking the perfect cut, BarberFactory is here to elevate your
              grooming experience. Join us in redefining the world of barbershop
              services!
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Developed By</Text>
            <View style={styles.developers}>
              <View style={styles.developer}>
                <Image
                  source={require('../../assets/images/KhaledjallouliImage.jpg')}
                  style={styles.developerImage}
                />
                <Text style={styles.developerName}>Khaled Jallouli</Text>
              </View>
              <View style={styles.developer}>
                <Image
                  source={require('../../assets/images/KhairiTaboubiImage.jpg')}
                  style={styles.developerImage}
                />
                <Text style={styles.developerName}>Khairi Taboubi</Text>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.copyrightText}>
              © {currentYear} BarberFactory. All rights reserved.
            </Text>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerGradient: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'BebasNeue-Regular',
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 24,
    color: '#2ECC71',
    fontFamily: 'BebasNeue-Regular',
    marginBottom: 15,
  },
  text: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
    lineHeight: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'Poppins-Regular',
    marginLeft: 15,
  },
  developers: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  developer: {
    alignItems: 'center',
  },
  developerImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  developerName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#333',
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  copyrightText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  versionText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
  },
});

export default AboutScreen;