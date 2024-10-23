import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import * as Font from 'expo-font';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import SplashScreen from '../entry/SplashScreen';
import WelcomeScreen from '../entry/WelcomeScreen';
import LoginScreen from '../entry/LoginScreen';
import RegisterScreen from '../entry/RegisterScreen';
import EditProfile from '../components/EditProfile';
import StoryUpload from '../mediaupload/StoryUpload';
import MessageScreen from '../screens/MessageScreen';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
import ChatScreen from '../screens/ChatScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  const loadFonts = async () => {
    await Font.loadAsync({
      'ms-regular': require('../assets/fonts/ms-regular.ttf'),
      'ms-bold': require('../assets/fonts/ms-bold.ttf'),
      'ms-light': require('../assets/fonts/ms-light.ttf'),
      'ms-italic': require('../assets/fonts/ms-italic.ttf'),
    });
  };

  const fetchCurrentUser = async (user) => {
    const db = getFirestore();
    const userRef = doc(db, 'userInfo', user.uid);

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
        setCurrentUser(null);
      }
    }, (error) => {
      console.error("Error fetching user data:", error);
      setCurrentUser(null);
    });

    return unsubscribe;
  };

  const toggleMenu = () => {
    setMenuVisible((prevMenuVisible) => !prevMenuVisible);
  };

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));

    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // // TopNavigation'u sadece belirli ekranlarda gizliyoruz
  // const shouldShowTopNavigation = (routeName) => {
  //   const hideTopNavScreens = ['Splash', 'Welcome', 'Login', 'Register', 'ChatScreen'];
  //   return !hideTopNavScreens.includes(routeName); // Bu ekranlar dışında TopNavigation gösterilir
  // };

  return (
    <NavigationContainer>
      <View style={{ flex: 1 }}>
        {/* {currentUser && shouldShowTopNavigation(Stack.Navigator) && ( */}
          {/* <TopNavigation onMenuPress={toggleMenu} user={currentUser} /> */}
        {/* )} */}
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="HomeTabs"
            component={BottomNavigation}
            options={{ headerShown: false, gestureEnabled: false }}
          />
          <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
          <Stack.Screen name="StoryUpload" component={StoryUpload} options={{ headerShown: false }} />
          <Stack.Screen name="MessageScreen" component={MessageScreen} options={{ headerShown: false }} />
          <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
};

export default AppNavigator;
