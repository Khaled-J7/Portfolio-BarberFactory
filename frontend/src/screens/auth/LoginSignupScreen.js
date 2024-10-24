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
} from 'react-native';
import * as Font from 'expo-font'; // Importing Font API from Expo to load custom fonts

// Function to load custom fonts (BebasNeue and Poppins)
const loadFonts = async () => {
  await Font.loadAsync({
    'BebasNeue-Regular': require('../../assets/fonts/BebasNeue-Regular.ttf'),
    'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
  });
};

// Main functional component for the login/signup screen
const LoginSignupScreen = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and signup modes
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load fonts when the component mounts
  React.useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  // If fonts are not yet loaded, show a loading spinner
  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />; // Loading spinner
  }

  // Toggle between login and signup modes
  const toggleMode = () => setIsLogin(!isLogin);

  const handleSkip = () => {
    navigation.navigate('Home'); // Navigate to HomeScreen
  };

  const handleSubmit = () => {
    navigation.navigate('Home'); // For now, just navigate to HomeScreen
  };
  // Renders the login form (fields for phone number and password)
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
  // Renders the signup form (includes full name, phone number, password, and confirm password)
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
  // Main render method
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={require('../../assets/att.Fr_9jx6reYE_J213nNP70xO5ko-eXzdnnHv8v7NMcgo-removebg-preview-removebg-preview.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>{isLogin ? 'LOGIN' : 'SIGN UP'}</Text>
        <View style={styles.formContainer}>
          {isLogin ? renderLoginForm() : renderSignupForm()}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>
              {isLogin ? 'Login' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleMode}>
            <Text style={styles.toggleText}>
              {isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Login"}
            </Text>
          </TouchableOpacity>
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
    fontFamily: 'BebasNeue-Regular', // Use BebasNeue for titles
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
    fontFamily: 'Poppins-Bold', // Poppins Bold for labels
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
    fontFamily: 'Poppins-Regular', // Poppins Regular for inputs
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
    fontFamily: 'Poppins-Bold', // Poppins Bold for button text
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
  },
  toggleText: {
    fontFamily: 'Poppins-Regular', // Poppins Regular for toggle text
    color: '#262525',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  skipText: {
    fontFamily: 'Poppins-Regular', // Poppins Regular for skip text
    color: '#262525',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15,
    opacity: 0.8,
  },
});

export default LoginSignupScreen;
