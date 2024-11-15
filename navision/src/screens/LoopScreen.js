import React, { useEffect, useState,useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native'; // Sayfa odak kontrolü için
//icons
import CommentLoop from '../assets/icons/loopicons/CommentLoop';
import DropDownLoop from '../assets/icons/loopicons/DropdownLoop';
import HeartLoop from '../assets/icons/loopicons/HeartLoop';
import MoreLoop from '../assets/icons/loopicons/MoreLoop';
import SearchLoop from '../assets/icons/loopicons/SearchLoop';
import SendLoop from '../assets/icons/loopicons/SendLoop';
import LocationLoop from '../assets/icons/loopicons/LocationLoop';
import MusicLoop from '../assets/icons/loopicons/MusicLoop';
import CameraLoop from '../assets/icons/loopicons/CameraLoop';
import LoopTitle from '../assets/icons/loopicons/LoopTitle';
//firebase
import { getFirestore, collection, onSnapshot, query, orderBy,doc,getDoc,updateDoc,arrayUnion,arrayRemove } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
//expo
import { Video } from 'expo-av';
//component,modals
import LoopComment from '../modals/LoopComment';
import ShareModal from '../modals/ShareModal';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoopScreen = ({ navigation }) => {
  const [loops, setLoops] = useState([]);
  const firestore = getFirestore();
  const storage = getStorage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const isFocused = useIsFocused(); // Sayfanın odakta olup olmadığını kontrol etmek için
  const [selectedLoopId, setSelectedLoopId] = useState(null);

  //caption show full caption
  const [showFullCaptions, setShowFullCaptions] = useState({});
  const [expandedLoopId, setExpandedLoopId] = useState(null);
  const toggleCaption = (id) => {
    setExpandedLoopId((prev) => (prev === id ? null : id));
  };
  
  //current user auth
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const username = currentUser ? currentUser.username || currentUser.email || 'Anonim' : null;
  const [userProfile, setUserProfile] = useState({ username: null, profileImage: null });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (currentUser) {
          const userRef = doc(firestore, 'userInfo', currentUser.uid);
          const userDoc = await getDoc(userRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserProfile({
              username: userData.username || 'Anonim', // Kullanıcı adını al
              profileImage: userData.profileImage || 'https://via.placeholder.com/150', // Profil resmini al
            });
          } else {
            console.warn('Kullanıcı Firestore içinde bulunamadı.');
          }
        }
      } catch (error) {
        console.error('Kullanıcı bilgileri alınırken hata oluştu:', error);
      }
    };
  
    fetchUserProfile();
  }, [currentUser]);
  //likes
  const handleLike = async (loopId) => {
    try {
      const user = username; // Giriş yapmış kullanıcının username'i
      const loopRef = doc(firestore, 'loops', loopId);
      const loopDoc = await getDoc(loopRef);
  
      if (loopDoc.exists()) {
        const loopData = loopDoc.data();
        const { likedBy = [] } = loopData;
  
        if (likedBy.includes(user)) {
          // Kullanıcı zaten beğendiyse, beğeniyi geri çek
          await updateDoc(loopRef, {
            likes: loopData.likes - 1,
            likedBy: arrayRemove(user),
          });
        } else {
          // Kullanıcı beğeni yapıyorsa
          await updateDoc(loopRef, {
            likes: (loopData.likes || 0) + 1,
            likedBy: arrayUnion(user),
          });
        }
      }
    } catch (error) {
      console.error('Like işlemi sırasında hata oluştu:', error);
    }
  };
  //comment
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const handleCommentPress = (loopId) => {
    setSelectedLoopId(loopId);
    setIsCommentsModalVisible(true);
  };
  const closeCommentsModal = () => {
    setIsCommentsModalVisible(false);
  };
  //shares
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const openShareModal = () => setIsShareModalVisible(true);
  const closeShareModal = () => setIsShareModalVisible(false);



  const fetchLoops = () => {
    const loopsQuery = query(
      collection(firestore, 'loops'),
      orderBy('timestamp', 'desc')
    );
  
    const unsubscribe = onSnapshot(loopsQuery, async (querySnapshot) => {
      try {
        const fetchedLoops = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        setLoops(fetchedLoops);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    });
  
    return () => unsubscribe();
  };
  
  
  useEffect(() => {
    fetchLoops();
  
    return () => {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pauseAsync();
          video.setIsMutedAsync(true);
        }
      });
    };
  }, []);

  useEffect(() => {
    // Sayfa odakta değilken videoları durdur
    if (!isFocused) {
      videoRefs.current.forEach((video) => {
        if (video) {
          video.pauseAsync();
          video.setIsMutedAsync(true);
        }
      });
    }

    // Sayfa odakta ise görünür videoyu oynat
    if (isFocused) {
      const visibleVideo = videoRefs.current[currentIndex];
      if (visibleVideo) {
        visibleVideo.playAsync();
        visibleVideo.setIsMutedAsync(false);
      }
    }
  }, [isFocused]);
  const handleViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);

      videoRefs.current.forEach((video, i) => {
        if (video) {
          if (i === index) {
            video.playAsync();
            video.setIsMutedAsync(false);
          } else {
            video.pauseAsync();
            video.setIsMutedAsync(true);
          }
        }
      });
    }
  }).current;

  const renderItem = ({ item, index }) => {
    const isLiked = item.likedBy?.includes(username);
    const isExpanded = expandedLoopId === item.id;
    
    return (
      <View style={styles.container}>
        {/* Video */}
        {item.loopUrl?.[0] && (
          <Video
            source={{ uri: item.loopUrl[0] }}
            style={styles.video}
            resizeMode="cover"
            isLooping
            shouldPlay={isFocused && currentIndex === index}
            isMuted={!isFocused || currentIndex !== index}
            ref={(ref) => (videoRefs.current[index] = ref)}
          />
        )}
  
        {/* Etkileşim Düğmeleri */}
        <View style={styles.interactionButtons}>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => handleLike(item.id)}
          >
            <HeartLoop
              width={20}
              height={20}
              color={isLiked ? 'red' : 'white'}
            />
            <Text style={styles.iconText}>{item.likes || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => handleCommentPress(item.id)} 
          >
            <CommentLoop width={20} height={20} color="white" />
            <Text style={styles.iconText}>{item.commentsCount || 0}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer} onPress={openShareModal}>
            <SendLoop width={20} height={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconContainer}>
            <MoreLoop width={20} height={20} color="white" />
          </TouchableOpacity>
        </View>
  
        {/* Alt Kısım */}
        <View style={[styles.bottomContainer, isExpanded && styles.expandedBottomContainer]}>
          <Image
            source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <View>
            <Text style={styles.username}>@{item.username}</Text>
            <TouchableOpacity onPress={() => toggleCaption(item.id)}>
          <Text
            style={[
              styles.caption,
              isExpanded && styles.fullCaption, 
            ]}
          >
            {isExpanded ? item.description : item.description.slice(0, 35) + '...'}
          </Text>
        </TouchableOpacity>
          </View>
        </View>
        <View style={styles.locationMusicContainer}>
              <TouchableOpacity style={styles.iconTextBackground}>
                <LocationLoop width={12} height={12} color="white" />
                <Text style={styles.location}>{item.location?.country || 'Bilinmiyor'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconTextBackground}>
                <MusicLoop width={12} height={12} color="white" />
                <Text style={styles.author}>David G.</Text>
              </TouchableOpacity>
            </View>
      </View>
    );
  };
  
  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBackground}>
          <SearchLoop width={22} height={22} color="white" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <TouchableOpacity>
            <LoopTitle width={43} height={43} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.dropdownIcon}>
            <DropDownLoop width={12} height={12} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.iconBackgroundCamera} onPress={() => navigation.navigate('LoopUpload')}>
          <CameraLoop width={34} height={34} color="white" />
        </TouchableOpacity>
      </View>

      {/* Loop List */}
      <FlatList
        data={loops}
        keyExtractor={(item) => item.id}
        renderItem={renderItem} // Güncellenmiş renderItem fonksiyonu burada kullanılıyor
        contentContainerStyle={styles.listContainer}
        scrollEventThrottle={8}
        pagingEnabled
        decelerationRate="fast"
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / SCREEN_HEIGHT
          );
          setCurrentIndex(index);

          videoRefs.current.forEach((video, i) => {
            if (video) {
              if (i === index) {
                video.playAsync();
                video.setIsMutedAsync(false);
              } else {
                video.pauseAsync();
                video.setIsMutedAsync(true);
              }
            }
          });
        }}
        showsVerticalScrollIndicator={false}
      />

    <LoopComment
      visible={isCommentsModalVisible}
      onClose={closeCommentsModal}
      loopId={selectedLoopId}
      user={{
        username: userProfile.username, // Firestore'dan doğru alınması gerekiyor
        profileImage: userProfile.profileImage,
      }}
    />
    <ShareModal visible={isShareModalVisible} onClose={closeShareModal} />




    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'black',
  },
  listContainer: {
    flexGrow: 1,
  },
  container: {
    height: SCREEN_HEIGHT, // Ekran yüksekliği kadar her bir öğe
    justifyContent: 'space-between',
  },
  
  
  video: {
    flex: 1,
    height: '100%', // Ekran yüksekliği kadar video
    width: '100%',
    resizeMode: 'cover',
  },
  
  topBar: {
    position: 'absolute',
    top: 25,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    padding: 20,
    zIndex: 2,
  },
  iconBackground: {
    backgroundColor: 'background: rgba(0, 0, 0, 0.4);',
    borderRadius: 20,
    padding: 8,
  },
  iconBackgroundCamera: {
    backgroundColor: 'background: rgba(0, 0, 0, 0.4);',
    borderRadius: 20,
    padding: 3,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    marginLeft: 5,
  },
  interactionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    bottom: 120,
    alignItems: 'center',
    backgroundColor: 'background: rgba(0, 0, 0, 0.4);', // Yarı saydam siyah arka plan
    borderRadius: 33, // Yuvarlak köşeler
    paddingVertical: 4, // Dikey dolgu
    paddingHorizontal: 17, // Yatay dolgu
    
    zIndex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop:10,
  
  },
  moreIcon: {
    marginTop: 8, // SendLoop ikonu altına yerleştirildi
    marginBottom:-5,
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'ms-regular', // Etkileşim sayılarına regular font
    marginTop: 3,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 10,
    marginBottom:40,
  },
  username: {
    color: 'white',
    fontSize: 14,
    fontFamily:'ms-bold',
    position:'absolute',
    bottom:12,

  },
  //showfullCaption
  expandedContainer: {
    paddingVertical: 10,
    marginRight:10,
  },
  expandedBottomContainer: {
    bottom: 150,
  },
  fullCaption: {
    padding: 5,
    borderRadius: 5,
    overflow: 'hidden',
    marginRight:50,
    maxWidth: 240, // Genişlik sınırı
    lineHeight: 18, // Satır aralığı
    
  },
  caption: {
    color: 'white',
    marginTop: 5,
    fontSize:12,
    fontFamily:'ms-regular',
    position:'absolute',
    bottom:-7,
    left:0,
    maxWidth: 240, // Genişlik sınırı
    lineHeight: 18, // Satır aralığı
  },
  
  locationMusicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    position:'absolute',
    top:730,
    left:20,
  },
  iconTextBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'background: rgba(0, 0, 0, 0.4);',
    borderRadius: 15,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  location: {
    color: 'white',
    marginLeft: 4,
    fontFamily:'ms-light',
  },
  author: {
    color: 'white',
    marginLeft: 4,
    fontFamily:'ms-light',
  },
});

export default LoopScreen;
