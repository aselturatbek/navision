import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../entry/LoginScreen';
import RegisterScreen from '../entry/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MessageScreen from '../screens/MessageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SideMenu from '../components/SideMenu';
import EditProfile from '../components/EditProfile';
import * as Font from 'expo-font'; // Import expo-font
import HomeIcon from '../assets/icons/HomeIcon';
import BagIcon from '../assets/icons/BagIcon';
import GridIcon from '../assets/icons/GridIcon';
import MessageIcon from '../assets/icons/MessageIcon';
import NotificationIcon from '../assets/icons/NotificationIcon';
import MoreIcon from '../assets/icons/MoreIcon';
import PlusIcon from '../assets/icons/PlusIcon';
import SearchIcon from '../assets/icons/SearchIcon';
import { getAuth } from 'firebase/auth'; 
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import StoryUpload from '../mediaupload/StoryUpload';
import PostUpload from '../mediaupload/PostUpload';
import WelcomeScreen from '../entry/WelcomeScreen';


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const fetchCurrentUser = async (setCurrentUser) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    const db = getFirestore();
    const userRef = doc(db, 'userInfo', user.uid);

    // Firestore'daki verileri dinlemek için onSnapshot kullanın
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        const userData = doc.data();
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          profileImage: userData.profileImage || 'https://via.placeholder.com/150',
          displayName: userData.username || user.email.split('@')[0],
        });
      } else {
        setCurrentUser(null); // Kullanıcı verisi yoksa null döndür
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
      setCurrentUser(null); // Hata durumunda da null döndür
    });

    // Unsubscribe from the listener on component unmount
    return unsubscribe;
  } else {
    setCurrentUser(null); // Kullanıcı yoksa null döndür
  }
};

const Header = ({ onMenuPress, user }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 18, backgroundColor: 'transparent', marginTop: 30 }}>
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'ms-bold', marginTop: 8, marginLeft: 10 }}>
          navision <MoreIcon />
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 5, marginBottom: -15 }}>
          <NotificationIcon size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <MessageIcon size={25} color="black" />
        </TouchableOpacity>
        <Image 
          source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>
    </View>
  );
};

const HomeTabs = ({ route, navigation }) => {
  const { username, profileImage, name, surname } = route.params || {};
  const [menuVisible, setMenuVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  // fetchCurrentUser fonksiyonunu doğrudan useEffect içinde çağır
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const db = getFirestore();
      const userRef = doc(db, 'userInfo', user.uid);

      // Firestore'daki verileri dinlemek için onSnapshot kullanın
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setCurrentUser({
            uid: user.uid,
            email: user.email,
            profileImage: userData.profileImage || 'https://via.placeholder.com/150',
            displayName: userData.username || user.email.split('@')[0],
          });
        } else {
          setCurrentUser(null); // Kullanıcı verisi yoksa null döndür
        }
      }, (error) => {
        console.error("Error fetching user data:", error);
        setCurrentUser(null); // Hata durumunda da null döndür
      });

      // Dinleyiciyi bileşen unmount olduğunda kaldır
      return () => {
        if (unsubscribe) {
          unsubscribe(); // Dinleyiciyi kaldır
        }
      };
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Header onMenuPress={toggleMenu} user={currentUser} />
      {menuVisible && (
        <SideMenu onClose={() => setMenuVisible(false)} />
      )}
      <Tab.Navigator screenOptions={{
        headerShown: false, 
        tabBarStyle: { backgroundColor: 'transparent', borderTopWidth: 0, elevation: 0, padding: 10, paddingHorizontal: 20 },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray' 
      }}>
        <Tab.Screen 
          name="Home" 
          children={() => <HomeScreen username={username} profileImage={profileImage} name={name} surname={surname} />} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => <HomeIcon size={25} color={focused ? "black" : color} /> 
          }} 
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => <SearchIcon size={25} color={focused ? "black" : color} />
          }}
        />
        <Tab.Screen 
          name="PostUpload" 
          component={PostUpload} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({ color, focused }) => <PlusIcon color={focused ? "black" : color} />
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
            tabBarIcon: ({ color, focused }) => <BagIcon size={25} color={focused ? "black" : color} /> 
          }} 
        />
      </Tab.Navigator>
    </View>
  );
};

const AppNavigator = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'ms-regular': require('../assets/fonts/ms-regular.ttf'),
      'ms-bold': require('../assets/fonts/ms-bold.ttf'),
      'ms-light': require('../assets/fonts/ms-light.ttf'),
      'ms-italic': require('../assets/fonts/ms-italic.ttf'),
    });
  };

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
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false}} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="StoryUpload" component={StoryUpload} options={{ headerShown: false }} />
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
