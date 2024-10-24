import React, { useState, useEffect, useCallback } from 'react';
import { View, Text } from 'react-native';
//firebase
import { getFirestore, doc, onSnapshot, collection } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//components
import TopNavigation from '../components/TopNavigation';
import SideMenu from '../components/SideMenu';

const Default2 = () => {
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

  return (
    <View>
      <TopNavigation onMenuPress={toggleMenu} user={currentUser} />
      <Text>Default Page</Text>
     {menuVisible && <SideMenu onClose={toggleMenu} />}
    </View>
  );
};

export default Default2;
