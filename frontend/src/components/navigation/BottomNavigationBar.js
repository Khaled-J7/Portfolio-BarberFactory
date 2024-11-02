// BottomNavigationBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons'; // Using Expo icons instead of lucide-react

const BottomNavigationBar = ({ navigation }) => {
  const [isBarber, setIsBarber] = React.useState(false);
  const route = useRoute();

  // Fetch user role on component mount
  React.useEffect(() => {
    const getUserRole = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { isBarber } = JSON.parse(userData);
          setIsBarber(isBarber);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
    getUserRole();
  }, []);

  // Navigation items with Feather icons
  const navItems = [
    {
      name: 'Explore',
      iconName: 'search',
      route: 'Explore'
    },
    {
      name: 'Home',
      iconName: 'home',
      route: 'Home'
    },
    {
      name: 'Appointments',
      iconName: 'calendar',
      route: 'Appointments'
    },
    {
      name: isBarber ? 'Store' : 'Profile',
      iconName: isBarber ? 'shopping-bag' : 'user',
      route: isBarber ? 'Store' : 'Profile'
    }
  ];

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const isActive = route.name === item.route;
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.tabContainer}
            onPress={() => navigation.navigate(item.route)}
          >
            <Feather
              name={item.iconName}
              size={24}
              color={isActive ? '#2ECC71' : '#262525'}
              style={styles.icon}
            />
            <Text
              style={[
                styles.tabText,
                isActive && styles.activeTabText
              ]}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    marginBottom: 4,
  },
  tabText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#262525',
    marginTop: 2,
  },
  activeTabText: {
    color: '#2ECC71',
    fontFamily: 'Poppins-Bold',
  },
});

export default BottomNavigationBar;