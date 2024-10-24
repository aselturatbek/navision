import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//expo
import * as Font from 'expo-font';
//icons
import NotificationIcon from '../assets/icons/NotificationIcon';
import MessageIcon from '../assets/icons/MessageIcon';
import MoreIcon from '../assets/icons/MoreIcon';
//firebase
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';
//components
import SideMenu from './SideMenu';

const TopNavigation = ({ onMenuPress, user }) => {
  const navigation = useNavigation();
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
        <TouchableOpacity 
          style={{ marginRight: 16 }} 
          onPress={() => navigation.navigate('MessageScreen')}
        >
          <MessageIcon size={25} color="black" />
        </TouchableOpacity>
        {/* Profil Fotoğrafı Tıklama */}
        <TouchableOpacity 
          onPress={() => navigation.navigate('Profile')}
        >
          <Image 
            source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }}
            style={{ width: 40, height: 40, borderRadius: 20 }}
          />
        </TouchableOpacity>
      </View>
      {menuVisible && <SideMenu onClose={toggleMenu} />}
    </View>
  );
};

export default TopNavigation;
