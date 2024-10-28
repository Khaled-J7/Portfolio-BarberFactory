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
  Alert,
} from 'react-native';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authService from '../../services/authService';

const LoginSignupScreen = ({ navigation }) => {
  // State management
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load custom fonts when component mounts
  React.useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  // Function to load custom fonts
  const loadFonts = async () => {
    await Font.loadAsync({
      'BebasNeue-Regular': require('../../assets/fonts/BebasNeue-Regular.ttf'),
      'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
      'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
    });
  };

  // Form validation function
  const validateForm = () => {
    // Reset any previous errors
    setError('');

    // Common validation for both login and signup
    if (!formData.phoneNumber || !formData.password) {
      setError('Phone number and password are required');
      return false;
    }

    // Additional validation for signup
    if (!isLogin) {
      if (!formData.fullName) {
        setError('Full name is required');
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

  // Handle form submission (login/signup)
  const handleSubmit = async () => {
    try {
      // Validate form
      if (!validateForm()) return;

      setLoading(true);
      let response;

      if (isLogin) {
        // Handle login
        response = await authService.login({
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        });
      } else {
        // Handle signup
        response = await authService.register({
          fullName: formData.fullName,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        });
      }

      // Store user data and token
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));

      // Navigate to Home screen
      navigation.replace('Home');
    } catch (error) {
      setError(error.message || 'Something went wrong');
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle skip functionality
  const handleSkip = () => {
    navigation.replace('Home');
  };

  // Toggle between login and signup modes
  const toggleMode = () => setIsLogin(!isLogin);

  // Show loading spinner while fonts are loading
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#262525" />;
  }

  // Render login form fields
  const renderLoginForm = () => (
    <>
      <Text style={styles.inputLabel}>Phone Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your phone number"
        placeholderTextColor="#666"
        value={formData.phoneNumber}
        onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
        keyboardType="phone-pad"
      />
      <Text style={styles.inputLabel}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        placeholderTextColor="#666"
        value={formData.password}
        onChangeText={(text) => setFormData({ ...formData, password: text })}
        secureTextEntry
      />
    </>
  );

  // Render signup form fields
  const renderSignupForm = () => (
    <>
      <Text style={styles.inputLabel}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your full name"
        placeholderTextColor="#666"
        value={formData.fullName}
        onChangeText={(text) => setFormData({ ...formData, fullName: text })}
      />
      {renderLoginForm()}
      <Text style={styles.inputLabel}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Confirm your password"
        placeholderTextColor="#666"
        value={formData.confirmPassword}
        onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
        secureTextEntry
      />
    </>
  );

  // Main render
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
      <Image
        source={require('../../assets/images/appLogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
        
        <Text style={styles.title}>{isLogin ? 'LOGIN' : 'SIGN UP'}</Text>
        
        <View style={styles.formContainer}>
          {/* Show error message if exists */}
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          
          {/* Render appropriate form based on mode */}
          {isLogin ? renderLoginForm() : renderSignupForm()}

          {/* Submit button with loading state */}
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

          {/* Toggle between login and signup */}
          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>

          {/* Skip option */}
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}>Skip for later</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
});

export default LoginSignupScreen;
