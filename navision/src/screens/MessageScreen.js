import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput, FlatList, Image, Dimensions } from 'react-native';
//firebase
import { db } from '../firebase';
import {getFirestore, doc, collection, query, where, getDocs, onSnapshot,addDoc} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//expo
import * as Font from 'expo-font';
// icons
import SearchChatIcon from '../assets/icons/SearchChatIcon';
import ThreeLineIcon from '../assets/icons/ThreeLine';
//components
import MapComponent from '../components/chatscreen/MapComponent';
import ChatsComponent from '../components/chatscreen/ChatsComponent';
import FabComponent from '../components/chatscreen/FabComponent';
import TopNavigation from '../components/TopNavigation';
import SideMenu from '../components/SideMenu';
import { useNavigation } from '@react-navigation/native'; // Navigation

// Varsayılan profil resmi URL'si
const defaultProfileImage = 'https://via.placeholder.com/150'; // Varsayılan bir resim URL'si

const MessageScreen = () => {
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const animation = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation(); // Navigation için ekleme

  //top navigation 
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
        const userId = doc.id; // userId'yi buradan alıyoruz
        console.log('User ID:', userId); // Kullanıcı ID'sini consola yazdırıyoruz

        setCurrentUser({
          id: userId,  // Firestore'dan dönen belgenin otomatik ID'si
          userId: userId,  // Firestore'un otomatik olarak oluşturduğu ID'yi kullanıyoruz
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

  //topnavigation

  const toggleSearch = () => {
    const toValue = searchMode ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setSearchMode(!searchMode);
  };

  // Firestore'dan kullanıcıları arayan fonksiyon
  const searchUsers = async (queryText) => {
    if (queryText.length === 0) {
      setSearchResults([]);
      return;
    }

    try {
      const q = query(
        collection(db, 'userInfo'), 
        where('username', '>=', queryText), 
        where('username', '<=', queryText + '\uf8ff')
      );
      const querySnapshot = await getDocs(q);
      const users = [];

      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        users.push({
          id: doc.id,  // Firestore'dan dönen belgenin otomatik ID'si
          userId: doc.id,  // Firestore'un otomatik olarak oluşturduğu ID'yi kullanıyoruz
          username: userData.username,
          profileImage: userData.profileImage || defaultProfileImage, // Profil resmi yoksa varsayılan resmi kullan
        });
      }

      setSearchResults(users);
    } catch (error) {
      console.error('Kullanıcı arama hatası:', error);
    }
  };

  useEffect(() => {
    if (searchQuery !== '') {
      searchUsers(searchQuery);
    }
  }, [searchQuery]);

  const titleOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const searchBarWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const searchInputOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Kullanıcıya tıklandığında ChatScreen'e yönlendirme
  const handleUserPress = async (selectedUser) => {
    try {
      const db = getFirestore();
      const auth = getAuth();
      const currentUser = auth.currentUser;
  
      // Sohbet koleksiyonunda daha önce bu kullanıcıyla bir sohbet var mı kontrol et
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('users', 'array-contains', currentUser.uid));
      const querySnapshot = await getDocs(q);
  
      let existingChat = null;
  
      querySnapshot.forEach((doc) => {
        const chatData = doc.data();
        if (chatData.users.includes(selectedUser.id)) {
          existingChat = { id: doc.id, ...chatData };
        }
      });
  
      // Eğer geçmiş bir sohbet varsa, onun ID'si ile ChatScreen'e git
      if (existingChat) {
        navigation.navigate('ChatScreen', { chatId: existingChat.id, user: selectedUser });
      } else {
        // Eğer geçmiş sohbet yoksa yeni bir sohbet başlat
        const newChatRef = await addDoc(collection(db, 'chats'), {
          users: [currentUser.uid, selectedUser.id],
          createdAt: new Date(),
        });
        navigation.navigate('ChatScreen', { chatId: newChatRef.id, user: selectedUser });
      }
    } catch (error) {
      console.error('Error checking or starting chat:', error);
    }
  };
  

  const renderSearchResults = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserPress(item)}>
      <View style={styles.chatItem}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.username}</Text>
          </View>
        </View>
      </View>
      <View style={styles.shortDivider} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TopNavigation onMenuPress={toggleMenu} user={currentUser} />
      <MapComponent />
      <View style={styles.header}>
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          Sohbetler
        </Animated.Text>

        <Animated.View style={[styles.searchContainer, { width: searchBarWidth, opacity: searchInputOpacity }]}>
          <TextInput
            style={styles.searchInput}
            placeholder="Sohbetlerde ara..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
        </Animated.View>

        <View style={styles.icons}>
          <TouchableOpacity style={styles.icon} onPress={toggleSearch}>
            <SearchChatIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <ThreeLineIcon />
          </TouchableOpacity>
        </View>
      </View>

      {searchMode && (
        <FlatList
          data={searchResults}
          renderItem={renderSearchResults}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.noResultsText}>Sonuç bulunamadı</Text>}
        />
      )}

      {!searchMode && <ChatsComponent />}
      <FabComponent />
      {menuVisible && <SideMenu onClose={toggleMenu} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 27,
    marginTop: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'ms-bold',
    color: 'black',
    marginBottom: 10,
  },
  searchContainer: {
    position: 'absolute',
    left: -5,
    right: 0,
    paddingHorizontal: 27,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 6,
    fontSize: 16,
    fontFamily: 'ms-regular',
    backgroundColor: '#f5f5f5',
  },
  icons: {
    flexDirection: 'row',
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 10,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: Dimensions.get('window').width - 40,
    marginLeft: 8,
  },
  shortDivider: {
    height: 1,
    backgroundColor: '#eee',
    width: 240,
    alignSelf: 'center',
    marginLeft: 25,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 15,
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontFamily: 'ms-bold',
    fontSize: 14,
    color: 'black',
  },
  noResultsText: {
    textAlign: 'center',
    fontFamily: 'ms-regular',
    color: '#999',
    marginTop: 20,
  },
});

export default MessageScreen;
