/**
 * LoginSignupScreen Component
 * Handles user authentication (login/signup) with form validation
 * Features:
 * - Toggle between login and signup modes
 * - Password visibility toggle
 * - Success modal for signup
 * - Form validation
 * - Keyboard avoiding behavior
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';

/**
 * Custom Password Input Component
 * Includes built-in visibility toggle
 */
const PasswordInput = ({ label, placeholder, value, onChangeText }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  return (
    <>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { paddingRight: 50 }]}
          placeholder={placeholder}
          placeholderTextColor="#666"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={!isVisible}
        />
        <TouchableOpacity
          style={styles.visibilityToggle}
          onPress={() => setIsVisible(!isVisible)}
        >
          <Ionicons
            name={isVisible ? "eye-off" : "eye"}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
    </>
  );
};

/**
 * Regular Input Component
 * For non-password fields
 */
const RegularInput = ({ label, placeholder, value, onChangeText, keyboardType }) => (
  <>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#666"
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType || 'default'}
    />
  </>
);

const RoleSelector = ({ selectedRole, onRoleChange }) => (
  <View style={styles.roleSelectorContainer}>
    <Text style={styles.inputLabel}>I am a:</Text>
    <View style={styles.roleOptionsContainer}>
      <TouchableOpacity 
        style={[
          styles.roleOption, 
          selectedRole === 'client' && styles.roleOptionSelected
        ]}
        onPress={() => onRoleChange('client')}
      >
        <Text style={[
          styles.roleOptionText,
          selectedRole === 'client' && styles.roleOptionTextSelected
        ]}>Client</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={[
          styles.roleOption, 
          selectedRole === 'barber' && styles.roleOptionSelected
        ]}
        onPress={() => onRoleChange('barber')}
      >
        <Text style={[
          styles.roleOptionText,
          selectedRole === 'barber' && styles.roleOptionTextSelected
        ]}>Barber</Text>
      </TouchableOpacity>
    </View>
  </View>
);
/**
 * Success Modal Component
 * Shows after successful signup
 */
const SuccessModal = ({ visible, onClose }) => (
  <Modal
    animationType="fade"
    transparent={true}
    visible={visible}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.successIconContainer}>
          <Ionicons name="checkmark-circle" size={60} color="#2ECC71" />
        </View>
        <Text style={styles.modalTitle}>Success!</Text>
        <Text style={styles.modalMessage}>
          Your account has been created successfully
        </Text>
        <TouchableOpacity
          style={styles.modalButton}
          onPress={onClose}
        >
          <Text style={styles.modalButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// Main Component
const LoginSignupScreen = ({ navigation }) => {
  // State Management
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'client', // default to client
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load custom fonts
  React.useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  const loadFonts = async () => {
    await Font.loadAsync({
      'BebasNeue-Regular': require('../../assets/fonts/BebasNeue-Regular.ttf'),
      'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    });
  };

  /**
   * Form validation
   * Returns: boolean indicating if form is valid
   */
  const validateForm = () => {
    setError('');

    if (!formData.phoneNumber || !formData.password) {
      setError('Phone number and password are required');
      return false;
    }

    if (!isLogin) {
      if (!formData.fullName) {
        setError('Full name is required');
        return false;
      }
      if (!formData.role) {
        setError('Please select your role');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  /**
   * Handle form submission
   * Manages both login and signup flows
   */
  const handleSubmit = async () => {
    try {
      if (!validateForm()) return;
      setLoading(true);
      
      let response;
      if (isLogin) {
        response = await authService.login({
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        });
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        navigation.replace('Home');
      } else {
        response = await authService.register({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
          isBarber: formData.role === 'barber' // Convert role to boolean
        });
        await AsyncStorage.setItem('userToken', response.token);
        await AsyncStorage.setItem('userData', JSON.stringify(response.user));
        setShowSuccessModal(true);
      }
    } catch (error) {
      setError(error.message || 'Something went wrong');
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Render login form
  const renderLoginForm = () => (
    <>
      <RegularInput
        label="Phone Number"
        placeholder="Enter your phone number"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        keyboardType="phone-pad"
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
    </>
  );

  // Render signup form
  const renderSignupForm = () => (
    <>
      <RegularInput
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      <RegularInput
        label="Phone Number"
        placeholder="Enter your phone number"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        keyboardType="phone-pad"
      />
      <RoleSelector
      selectedRole={formData.role}
      onRoleChange={(role) => setFormData({ ...formData, role })}
      />
      <PasswordInput
        label="Password"
        placeholder="Enter your password"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
      />
      <PasswordInput
        label="Confirm Password"
        placeholder="Confirm your password"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
      />
    </>
  );

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#262525" />;
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../assets/images/appLogo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.title}>{isLogin ? 'LOGIN' : 'SIGN UP'}</Text>
        
        <View style={styles.formContainer}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {isLogin ? renderLoginForm() : renderSignupForm()}

          <TouchableOpacity 
            style={styles.submitButton} 
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
            <Text style={styles.toggleText}>
              {isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.replace('Home')}>
            <Text style={styles.skipText}>Skip for later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <SuccessModal 
        visible={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          navigation.replace('Home');
        }}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ECC71',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginTop: 50,
  },
  title: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 60,
    color: '#262525',
    textAlign: 'center',
    marginVertical: 20,
    textDecorationLine: 'underline',
  },
  formContainer: {
    paddingHorizontal: 20,
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 15,
  },
  inputLabel: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#262525',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#262525',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  visibilityToggle: {
    position: 'absolute',
    right: 15,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
  },
  submitButton: {
    backgroundColor: '#262525',
    borderRadius: 15,
    padding: 15,
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  submitButtonText: {
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
  },
  toggleText: {
    fontFamily: 'Poppins-Regular',
    color: '#262525',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  skipText: {
    fontFamily: 'Poppins-Regular',
    color: '#262525',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    opacity: 0.8,
  },
  errorText: {
    fontFamily: 'Poppins-Regular',
    color: '#FF0000',
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '85%',
    maxWidth: 400,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#262525',
    marginBottom: 10,
  },
  modalMessage: {
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#2ECC71',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  modalButtonText: {
    fontFamily: 'Poppins-Bold',
    color: 'white',
    fontSize: 16,
  },
  // Role Selecting Styles
  roleSelectorContainer: {
    marginVertical: 15,
  },
  roleOptionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  roleOption: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleOptionSelected: {
    borderColor: '#262525',
    backgroundColor: '#262525',
  },
  roleOptionText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: '#262525',
  },
  roleOptionTextSelected: {
    color: '#FFFFFF',
  },
});

export default LoginSignupScreen;