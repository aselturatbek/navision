import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity,TouchableWithoutFeedback,FlatList,Modal,ScrollView} from 'react-native';
//firebase
import { auth } from '../firebase';
import { limit, startAfter,getFirestore, doc, getDoc ,onSnapshot,collection,query,where,orderBy} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
//icons
import EditIcon from '../assets/icons/profileicons/EditIcon';
import ReservationIcon from '../assets/icons/profileicons/ReservationIcon';
import CarouselIcon from '../assets/icons/profileicons/CarouselIcon';
import NavisionIcon from '../assets/icons/profileicons/NavisionIcon';
import AddIcon from '../assets/icons/AddIcon';
import Icon from "react-native-vector-icons/Entypo";
//options icons
import Grid from '../assets/icons/profileicons/Grid';
import Loop from '../assets/icons/profileicons/Loop';
import WorldLocation from '../assets/icons/profileicons/WorldLocation';
import MentionIcon from '../assets/icons/profileicons/MentionIcon';
import EntypoIcon from "react-native-vector-icons/Entypo";
//components
import TopNavigation from '../navigation/TopNavigation';
//expo
import * as Font from 'expo-font';


const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const firestore = getFirestore();
  //top navigation
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  //pop up
  const [selectedPost, setSelectedPost] = useState(null); // Popup için seçilen post
  const [isPopupVisible, setPopupVisible] = useState(false); // Popup görünürlüğü

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

  //fetch posts
  const POSTS_PER_PAGE = 10; // Her sayfada gösterilecek post sayısı
  const [lastVisiblePost, setLastVisiblePost] = useState(null);

  const fetchUserPosts = (userId, isLoadingMore = false) => {
    const db = getFirestore();
    let postsQuery = query(
      collection(db, 'posts'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(POSTS_PER_PAGE)
    );

    // Eğer daha fazla yükleniyorsa, `startAfter` kullanarak sıradaki postları çek
    if (isLoadingMore && lastVisiblePost) {
      postsQuery = query(postsQuery, startAfter(lastVisiblePost));
    }

    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const userPosts = [];
      querySnapshot.forEach((doc) => {
        userPosts.push({ id: doc.id, ...doc.data() });
      });

      // Son postu kaydet
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      setLastVisiblePost(lastVisible);

      // Yüklenmiş postları güncelle
      setUserInfo((prev) => ({
        ...prev,
        posts: isLoadingMore ? [...prev.posts, ...userPosts] : userPosts,
      }));
    });

    return unsubscribe;
  };

  // Daha fazla yükleme fonksiyonu
  const loadMorePosts = () => {
    fetchUserPosts(currentUser.uid, true); // Yüklemeye devam et
  };

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = fetchUserPosts(currentUser.uid);
      return () => unsubscribe();
    }
  }, [currentUser]);

  const handleUpdate = (updatedInfo) => {
    setUserInfo(updatedInfo); // Kullanıcı bilgisini güncelle
  };
  useEffect(() => {
    if (selectedPost) {
      console.log('Selected Post:', selectedPost);
    }
  }, [selectedPost]);
  

  const renderGridItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('UserPosts', { selectedPostId: item.id, userId: currentUser.uid });
      }}
      onLongPress={() => {
        setSelectedPost(item); // Seçilen postu ayarla
        setPopupVisible(true); // Pop-up görünürlüğünü ayarla
      }}
      style={styles.gridItem}
    >
      <Image
        source={{ uri: item.mediaUrls?.[0] || 'https://via.placeholder.com/150' }}
        style={{ width: '100%', height: '100%', borderRadius: 10 }}
      />
      {item.mediaUrls && item.mediaUrls.length > 1 && (
        <View style={styles.carouselIcon}>
          <CarouselIcon />
        </View>
      )}
    </TouchableOpacity>
  );
  
  

  if (!userInfo) {

    return <Text>Loading.....</Text>; // Veriler yüklenirken gösterilecek
  }

  return (
    <View style={styles.container}>
      <TopNavigation onMenuPress={toggleMenu} user={currentUser} />
      {/* header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: userInfo.profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { onUpdate: handleUpdate })}>
            <EditIcon/>
          </TouchableOpacity>
          <View style={styles.userInfoRow}>
              <Text style={styles.name}>{userInfo.name}</Text>
              <Text style={styles.name}>{userInfo.surname}</Text>
              <NavisionIcon style={styles.icon} />
              <Text style={styles.username}>@{userInfo.username}</Text>
            </View>
            <Text style={styles.biography}>{userInfo.biography}</Text>

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
        {/* actions */}
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
        {/* Story Highlights */}
        <View style={styles.storyHighlights}>
          <TouchableOpacity style={styles.storyAdd}>
            <AddIcon color='grey'/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.storyCircle}>
          </TouchableOpacity>
          <TouchableOpacity style={styles.storyCircle}>
          </TouchableOpacity>
        </View>
        {/* options Menu */}
        <View style={styles.optionsContainer}>
        <View style={styles.options}>
          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.optionIcon}>
              <Grid />
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionIcon1}>
              <Loop/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionIcon2}>
              <WorldLocation/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionIcon3}>
              <MentionIcon/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    

      {/* Popup Modal */}
      <Modal
        transparent={true}
        visible={isPopupVisible}
        animationType="slide"
        onRequestClose={() => setPopupVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPopupVisible(false)}>
          <View style={styles.popupContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.popupContent}>
              <View style={styles.popupHeader}>
                <Image
                  source={{ uri: selectedPost?.profileImage || 'https://via.placeholder.com/150' }}
                  style={styles.popupProfileImage}
                />
                <View style={styles.popupTitle}>
                  <Text style={styles.popupUsername}>{selectedPost?.username}</Text>
                  <Text style={styles.popupLocation}>
                    {selectedPost?.location?.city}, {selectedPost?.location?.country}
                  </Text>
                </View>
              </View>

                <Image
                  source={{ uri: selectedPost?.mediaUrls?.[0] || 'https://via.placeholder.com/300' }}
                  style={styles.popupImage}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      </View>

      {/* Grid Layout for posts */}
     {/* Grid Layout for posts */}
    <FlatList
      data={userInfo?.posts || []} // currentUser'a ait postlar
      renderItem={renderGridItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.grid}
      style={styles.gridList} // Yeni stil ekleniyor
    />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  //post popup
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  popupHeader:{
    marginLeft:-45,
    marginTop:-10,
  },
  popupContent: {
    width: 360,
    height:400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    alignItems: 'center',
    marginTop:-100
  },
  popupProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginBottom: 10,
    marginLeft:-90
  },
  popupTitle:{
    flexDirection:'column',
    marginTop:-55,
    marginLeft:-25,

  },
  popupUsername: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily:'ms-regular',
   
  },
  popupText: {
    fontSize: 16,
    textAlign: 'center',
    
  },
  popupLocation:{
    fontFamily:'ms-light',
    fontSize:12,

  },
  popupImage: {
    width: 360,
    height: 450,
    borderBottomLeftRadius:25,
    borderBottomRightRadius:25,
    marginTop: 15,
    resizeMode: 'cover', // Görselin düzgün görünmesi için
  },  
  closeButton: {
    backgroundColor: '#333',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 14,
  },
  //header
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
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginHorizontal: 10, // İkonun iki tarafına boşluk eklemek için
    width: 20,
    height: 20,
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
    right: 145,
    backgroundColor: '#fff',
    padding: 7,
    borderRadius: 20,
  },
  name: {
    fontSize: 18,
    fontFamily:'ms-bold',
    marginTop: 10,
    marginLeft:5
  },
  username: {
    fontSize: 12,
    fontFamily:'ms-regular',
    color: '#555',
    marginLeft:3,
    marginTop:13,
  },
 
  biography: {
    fontSize: 14,
    fontFamily:'ms-light',
    color: '#555',
    textAlign: 'center',
    marginTop: 0,
    marginLeft:5
  },
  //followers
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom:50,
    paddingRight:30,
    position:'absolute',
    marginLeft:145,
    marginTop:20
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 18,
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
  //actions
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position:'absolute',
    marginTop: 140,
    marginLeft:20,
    alignItems:'center',
  },
  followButton: {
    backgroundColor: '#000',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 8,
    marginHorizontal: 1,
    width:137,
    height:30.06,
    paddingTop:3,
    paddingRight:-6
 
  },
  messageButton: {
    backgroundColor: '#000',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 8,
    marginHorizontal: 5,
    width:137,
    height:30.06,
    paddingTop:3,
    paddingRight:-6
 
  },
  moreButton: {
    backgroundColor: '#000',
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 8,
    marginHorizontal: 5,
    width:58,
    height:30.06,
    paddingTop:3,
    paddingRight:-6
  },
  buttonText:{
    textAlign:'center',
    fontFamily:'ms-bold',
    color:'#fff',
    fontSize:12
  },
  //storyHighlights
  storyHighlights: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Yatay hizalama
    marginTop: 160, // Action buttons altına boşluk ekler
    marginLeft:-240,
  },
  storyCircle: {
    backgroundColor: '#ddd',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center', // Dikey hizalama
    alignItems: 'center', // Yatay hizalama
    marginHorizontal:5
  },
  storyAdd: {
    backgroundColor: 'transparent',
    height: 60,
    width: 60,
    borderRadius: 30,
    justifyContent: 'center', // Dikey hizalama
    alignItems: 'center', // Yatay hizalama
    marginHorizontal:5
  },
  storyText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ms-bold',
  },
  //options menu
  optionsContainer: {
    flex: 1,
    marginTop:-50,
    marginLeft:-200
  },
  options: {
    width: 347,
    height: 65,
    flexDirection: "row",
    marginTop: 272,
    alignSelf: "center"
  },
  optionIcon: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    width: 20,
    height: 22,
    marginTop: 2
  },
  optionIcon1: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    width: 20,
    height: 22,
    marginLeft: 72,
    marginTop:8,
  },
  optionIcon2: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    width: 20,
    height: 22,
    alignSelf: "flex-end",
    marginLeft: 75,
    marginTop:8,
  },
  optionIcon3: {
    color: "rgba(128,128,128,1)",
    fontSize: 20,
    width: 20,
    height: 22,
    marginLeft: 73,
    marginBottom:5,
  },
  iconRow: {
    height: 26,
    flexDirection: "row",
    flex: 1,
    marginRight: 28,
    marginLeft: 19,
    marginTop: 20
  },
  grid: {
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 12,
  },
  gridItem: {
    backgroundColor: '#e0e0e0',
    width: '48%',
    height: 160,
    marginBottom: 0,
    borderRadius: 10,
    position: 'relative', // CarouselIcon pozisyonu için gerekli
  },
  gridList: {
    marginTop: 40, // Daha fazla boşluk için değer artırılabilir
    paddingHorizontal:0, // Kenarlara boşluk ekler
  },
  
  carouselIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
});

export default ProfileScreen;
