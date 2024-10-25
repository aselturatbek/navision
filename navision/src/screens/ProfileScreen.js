import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
//firebase
import { auth } from '../firebase';
import { getFirestore, doc, getDoc ,onSnapshot} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//icons
import Icon from 'react-native-vector-icons/Ionicons';
import EditIcon from '../assets/icons/EditIcon';
import ReservationIcon from '../assets/icons/ReservationIcon';

//components
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const firestore = getFirestore();
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

  const fetchUserInfo = async () => {
    const userId = auth.currentUser.uid; // Giriş yapan kullanıcının ID'si
    const docRef = doc(firestore, 'userInfo', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserInfo(docSnap.data());
    } else {
      console.log('No such document!');
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Bileşen ilk yüklendiğinde kullanıcı bilgilerini çek
  }, []);

  const handleUpdate = (updatedInfo) => {
    setUserInfo(updatedInfo); // Kullanıcı bilgisini güncelle
  };

  const renderGridItem = () => (
    <View style={styles.gridItem} />
  );

  if (!userInfo) {
    return <Text>Loading...</Text>; // Veriler yüklenirken gösterilecek
  }

  return (
    <View style={styles.container}>
      <TopNavigation onMenuPress={toggleMenu} user={currentUser} />
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: userInfo.profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { onUpdate: handleUpdate })}>
            <EditIcon/>
          </TouchableOpacity>
          <View style={styles.userInfo}>
          <Text style={styles.username}>{userInfo.name} {userInfo.surname}</Text>
          <Text style={styles.handle}>@{userInfo.username}</Text>
          <Text style={styles.biography}>{userInfo.biography}</Text>
          </View>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>213</Text>
            <Text style={styles.statLabel}>Paylaşım</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>241</Text>
            <Text style={styles.statLabel}>Takipçi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>123</Text>
            <Text style={styles.statLabel}>Takip</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.buttonText}>Takip Et</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.buttonText}>Mesaj At</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <ReservationIcon/>
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Layout for posts */}
      <FlatList
        data={[1, 2, 3, 4, 5, 6]} // Test verileri
        renderItem={renderGridItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.grid}
      />
      <BottomNavigation />
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    padding: 20,
    alignItems: 'flex-start',
    flexDirection:'row',
    height:250
  },
  userInfo: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginTop:-20,
    marginLeft:6
  },
  editButton: {
    position: 'absolute',
    top: 38,
    right: 69,
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 20,
  },
  userInfo:{
    marginRight:20,


  },
  username: {
    fontSize: 20,
    fontFamily:'ms-bold',
    marginTop: 10,
    marginLeft:5
  },
  handle: {
    fontSize: 14,
    fontFamily:'ms-regular',
    color: '#555',
    marginLeft:5
  },
  biography: {
    fontSize: 14,
    fontFamily:'ms-light',
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
    marginRight:73
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom:50,
    paddingRight:30,
    position:'absolute',
    marginLeft:165,
    marginTop:20
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 15,
    
  },
  statCount: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'ms-bold'
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
    fontFamily:'ms-light'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position:'absolute',
    marginTop: 180,
    marginLeft:11,
    alignItems:'center',
  },
  followButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 8,
    width:140,
    height:35
  },
  messageButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    width:140,
    height:35
  },
  moreButton: {
    backgroundColor: '#ddd',
    alignItems:'center',
    borderRadius: 8,
    marginHorizontal: 5,
    width:50,
    height:35,
    paddingTop:3,
    paddingRight:-6
    
  },
  buttonText:{
    textAlign:'center',
    fontFamily:'ms-bold',
    color:'grey',
    fontSize:13


  },
  grid: {
    justifyContent: 'space-around',
    marginTop: 0,
    paddingHorizontal: 15,
    
  },
  gridItem: {
    backgroundColor: '#e0e0e0',
    width: '48%',
    height: 160,
    marginBottom: 10,
    borderRadius: 10,
  
  },
});

export default ProfileScreen;
