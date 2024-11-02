// src/screens/main/SettingsScreen.js
import React, { useState } from 'react';
import {
 View,
 Text,
 StyleSheet,
 TouchableOpacity,
 SafeAreaView,
 Switch,
 Platform,
 StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import CustomAlert from '../../components/ui/CustomAlert';

const SettingsScreen = ({ navigation }) => {
 const [isDarkMode, setIsDarkMode] = useState(false);
 const [themeAlertVisible, setThemeAlertVisible] = useState(false);
 const [updateAlertVisible, setUpdateAlertVisible] = useState(false);
 const [deleteAlertVisible, setDeleteAlertVisible] = useState(false);

 return (
   <SafeAreaView style={styles.container}>
     <View style={styles.header}>
       <TouchableOpacity 
         onPress={() => navigation.goBack()}
         style={styles.backButton}
       >
         <Feather name="arrow-left" size={24} color="#262525" />
       </TouchableOpacity>
       <Text style={styles.headerTitle}>Settings</Text>
       <View style={styles.headerRight} />
     </View>

     <View style={styles.content}>
       <TouchableOpacity style={styles.settingItem}>
         <View style={styles.settingItemLeft}>
           <Feather name="sun" size={24} color="#262525" />
           <Text style={styles.settingItemText}>Change Theme</Text>
         </View>
         <Switch
           value={isDarkMode}
           onValueChange={(value) => {
             setIsDarkMode(value);
             setThemeAlertVisible(true);
           }}
           trackColor={{ false: '#767577', true: '#2ECC71' }}
           thumbColor={isDarkMode ? '#fff' : '#f4f3f4'}
           ios_backgroundColor="#3e3e3e"
         />
       </TouchableOpacity>

       <TouchableOpacity 
         style={styles.settingItem}
         onPress={() => setUpdateAlertVisible(true)}
       >
         <View style={styles.settingItemLeft}>
           <Feather name="refresh-cw" size={24} color="#262525" />
           <Text style={styles.settingItemText}>Search For Updates</Text>
         </View>
         <Feather name="chevron-right" size={24} color="#262525" />
       </TouchableOpacity>

       <TouchableOpacity 
         style={[styles.settingItem, styles.deleteItem]}
         onPress={() => setDeleteAlertVisible(true)}
       >
         <View style={styles.settingItemLeft}>
           <Feather name="trash-2" size={24} color="#FF3B30" />
           <Text style={styles.deleteText}>Delete Account</Text>
         </View>
         <Feather name="chevron-right" size={24} color="#FF3B30" />
       </TouchableOpacity>
     </View>

     <CustomAlert
       visible={themeAlertVisible}
       onClose={() => setThemeAlertVisible(false)}
       type="theme"
     />
     <CustomAlert
       visible={updateAlertVisible}
       onClose={() => setUpdateAlertVisible(false)}
       type="update"
     />
     <CustomAlert
       visible={deleteAlertVisible}
       onClose={() => setDeleteAlertVisible(false)}
       type="delete"
       onConfirm={() => {
         // Handle delete account logic here
         console.log('Delete account confirmed');
         // You might want to navigate to login screen after successful deletion
         // navigation.replace('LoginSignup');
       }}
     />
   </SafeAreaView>
 );
};

const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#FFFFFF',
 },
 header: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   paddingHorizontal: 20,
   paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
   height: Platform.OS === 'ios' ? 90 : 60,
 },
 headerTitle: {
   fontFamily: 'Poppins-Bold',
   fontSize: 22,
   color: '#262525',
 },
 backButton: {
   padding: 8,
 },
 headerRight: {
   width: 40, // Same width as back button for balance
 },
 content: {
   flex: 1,
   paddingHorizontal: 20,
   paddingTop: 20,
 },
 settingItem: {
   flexDirection: 'row',
   alignItems: 'center',
   justifyContent: 'space-between',
   paddingVertical: 15,
   paddingHorizontal: 20,
   backgroundColor: '#F8F8F8',
   borderRadius: 15,
   marginBottom: 15,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.1,
   shadowRadius: 3,
   elevation: 3,
 },
 settingItemLeft: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 settingItemText: {
   fontFamily: 'Poppins-Regular',
   fontSize: 16,
   color: '#262525',
   marginLeft: 15,
 },
 deleteItem: {
   backgroundColor: '#FFF5F5',
 },
 deleteText: {
   fontFamily: 'Poppins-Regular',
   fontSize: 16,
   color: '#FF3B30',
   marginLeft: 15,
 },
});

export default SettingsScreen;