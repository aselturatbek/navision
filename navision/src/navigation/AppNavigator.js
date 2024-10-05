import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MessageScreen from '../screens/MessageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SideMenu from '../components/SideMenu';
import EditProfile from '../components/EditProfile';
import { Feather } from 'react-native-vector-icons'; // Feather icons
import * as Font from 'expo-font'; // Import expo-font
import HomeIcon from '../assets/icons/HomeIcon';
import BagIcon from '../assets/icons/BagIcon';
import GridIcon from '../assets/icons/GridIcon';
import MessageIcon from '../assets/icons/MessageIcon';
import NotificationIcon from '../assets/icons/NotificationIcon';
import MoreIcon from '../assets/icons/MoreIcon';
import PlusIcon from '../assets/icons/PlusIcon';
import SearchIcon from '../assets/icons/SearchIcon';


const loadFonts = async () => {
  await Font.loadAsync({
    'ms-regular': require('../assets/fonts/ms-regular.ttf'),
    'ms-bold': require('../assets/fonts/ms-bold.ttf'),
    'ms-light': require('../assets/fonts/ms-light.ttf'),
    'ms-italic': require('../assets/fonts/ms-italic.ttf'),
  });
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Header = ({ onMenuPress }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 18, backgroundColor: 'transparent', marginTop: 30 }}>
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'ms-bold', marginTop: 8, marginLeft:10  }}>navision <MoreIcon/></Text>
        
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 5, marginBottom:-15}}>
          <NotificationIcon size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <MessageIcon size={25} color="black" />
        </TouchableOpacity>
        <Image 
          source={require('../assets/images/default_cat.jpg')}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>
    </View>
  );
};

const HomeTabs = ({ route, navigation }) => {
  const { username, email} = route.params || {};
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <View style={{ flex: 1 }}>
      <Header onMenuPress={toggleMenu} />
      {menuVisible && (
        <SideMenu onClose={() => setMenuVisible(false)}/>
      )}
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0 ,padding:10,paddingHorizontal:20},
    tabBarActiveTintColor: 'black', 
    tabBarInactiveTintColor: 'gray' 
    }}>
        <Tab.Screen 
          name="Home" 
          children={() => <HomeScreen username={username} />} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused}) => <HomeIcon size={25} color={focused ? "black" : color} /> 
          }} 
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({ color,focused}) => <SearchIcon size={25} color={focused ? "black" : color} />
          }}
        />
        <Tab.Screen 
          name="EditProfile" 
          component={EditProfile} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => <PlusIcon color={focused ? "black" : color}/>
          }}
        />
        <Tab.Screen 
          name="Messages" 
          component={MessageScreen} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => <GridIcon size={25} color={focused ? "black" : color} />
          }} 
        />
        <Tab.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({ color,focused }) => <BagIcon   size={25} color={focused ? "black" : color} /> 
          }} 
        />
      </Tab.Navigator>
    </View>
  );
};

const AppNavigator = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  closeMenu: {
    color: 'blue',
    marginTop: 20,
  },
});

export default AppNavigator;
