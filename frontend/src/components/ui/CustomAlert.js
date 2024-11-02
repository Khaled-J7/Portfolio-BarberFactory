// src/components/ui/CustomAlert.js
import React from 'react';
import {
 View,
 Text,
 StyleSheet,
 Modal,
 TouchableOpacity,
 Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const CustomAlert = ({ visible, onClose, type, onConfirm }) => {
 let title, message, confirmText, confirmStyle, icon;

 switch (type) {
   case 'theme':
     title = 'Theme Settings';
     message = 'Theme customization is coming soon! We\'re working hard to bring you a personalized dark mode experience in our next update.';
     confirmText = 'Got it';
     icon = 'sun';
     break;
   case 'update':
     title = 'App Updates';
     message = 'Automatic update checking will be enabled in the next version. We\'ll notify you when new features become available!';
     confirmText = 'OK';
     icon = 'refresh-cw';
     break;
   case 'delete':
     title = 'Delete Account';
     message = 'Warning: This action cannot be undone. Your profile, appointments, and all associated data will be permanently deleted.';
     confirmText = 'Delete Account';
     confirmStyle = styles.deleteButton;
     icon = 'alert-triangle';
     break;
 }

 if (!visible) return null;

 return (
   <Modal
     transparent={true}
     visible={visible}
     animationType="fade"
     onRequestClose={onClose}
   >
     <View style={styles.overlay}>
       <View style={styles.alertContainer}>
         <View style={[
           styles.iconContainer,
           type === 'delete' && styles.deleteIconContainer
         ]}>
           <Feather 
             name={icon} 
             size={28} 
             color={type === 'delete' ? '#FF3B30' : '#2ECC71'} 
           />
         </View>

         <Text style={styles.title}>{title}</Text>
         <Text style={styles.message}>{message}</Text>

         <View style={styles.buttonContainer}>
           {type === 'delete' && (
             <TouchableOpacity
               style={styles.cancelButton}
               onPress={onClose}
             >
               <Text style={styles.cancelButtonText}>Cancel</Text>
             </TouchableOpacity>
           )}
           
           <TouchableOpacity
             style={[styles.confirmButton, confirmStyle]}
             onPress={() => {
               if (type === 'delete' && onConfirm) {
                 onConfirm();
               }
               onClose();
             }}
           >
             <Text style={[
               styles.confirmButtonText,
               type === 'delete' && styles.deleteButtonText
             ]}>
               {confirmText}
             </Text>
           </TouchableOpacity>
         </View>
       </View>
     </View>
   </Modal>
 );
};

const styles = StyleSheet.create({
 overlay: {
   flex: 1,
   backgroundColor: 'rgba(0, 0, 0, 0.6)',
   justifyContent: 'center',
   alignItems: 'center',
 },
 alertContainer: {
   width: width * 0.85,
   backgroundColor: '#FFFFFF',
   borderRadius: 20,
   padding: 20,
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
 iconContainer: {
   width: 60,
   height: 60,
   borderRadius: 30,
   backgroundColor: '#E8F8F0',
   justifyContent: 'center',
   alignItems: 'center',
   marginBottom: 15,
 },
 deleteIconContainer: {
   backgroundColor: '#FFF0F0',
 },
 title: {
   fontFamily: 'Poppins-Bold',
   fontSize: 20,
   color: '#262525',
   marginBottom: 10,
   textAlign: 'center',
 },
 message: {
   fontFamily: 'Poppins-Regular',
   fontSize: 16,
   color: '#666666',
   textAlign: 'center',
   marginBottom: 20,
   lineHeight: 24,
   paddingHorizontal: 10,
 },
 buttonContainer: {
   flexDirection: 'row',
   justifyContent: 'center',
   alignItems: 'center',
   width: '100%',
   paddingTop: 10,
 },
 confirmButton: {
   flex: 1,
   backgroundColor: '#2ECC71',
   paddingVertical: 12,
   borderRadius: 10,
   marginHorizontal: 5,
 },
 deleteButton: {
   backgroundColor: '#FF3B30',
 },
 cancelButton: {
   flex: 1,
   backgroundColor: '#F0F0F0',
   paddingVertical: 12,
   borderRadius: 10,
   marginHorizontal: 5,
 },
 confirmButtonText: {
   fontFamily: 'Poppins-Bold',
   fontSize: 16,
   color: '#FFFFFF',
   textAlign: 'center',
 },
 deleteButtonText: {
   color: '#FFFFFF',
 },
 cancelButtonText: {
   fontFamily: 'Poppins-Bold',
   fontSize: 16,
   color: '#262525',
   textAlign: 'center',
 },
});

export default CustomAlert;