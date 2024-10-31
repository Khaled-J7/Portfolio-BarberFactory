import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const BottomNavigationBar = ({ navigation, activeTab = 'Home' }) => {
  const tabs = [
    { name: 'Explore', icon: 'compass' },
    { name: 'Profile', icon: 'account-circle' },
    { name: 'Home', icon: 'home-circle' },
    { name: 'Appointments', icon: 'calendar' }
  ];

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.name}
          onPress={() => navigation.navigate(tab.name)}
          style={styles.tabBarItem}
        >
          <Icon
            name={tab.icon}
            size={30}
            color={activeTab === tab.name ? '#2ECC71' : '#F5F7F8'}
          />
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#3C3D37',
    borderTopWidth: 0,
    elevation: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBarItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  }
});

export default BottomNavigationBar;