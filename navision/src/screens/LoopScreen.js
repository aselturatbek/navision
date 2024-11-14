import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
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
import { getFirestore, collection, getDocs,onSnapshot,doc,updateDoc,getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
//expo
import { Video } from 'expo-av';


const timeAgo = (timestamp) => {
  const now = new Date();
  const loopDate = timestamp.toDate();
  const diffInMs = now - loopDate;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return `${Math.floor(diffInMs / (1000 * 60))}dk`;
  } else if (diffInHours < 24) {
    return `${diffInHours}sa`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}gün`;
  }
};

const LoopScreen = ({navigation,user, handleCommentPress, handleSharePress}) => {
  const [loops, setLoops] = useState([]);
  const [loading, setLoading] = useState(true);
  const firestore = getFirestore();
  const storage = getStorage();
  const scrollX = useRef(new Animated.Value(0)).current;

  const fetchLoops = () => {
    const unsubscribe = onSnapshot(collection(firestore, 'loops'), async (querySnapshot) => {
      const fetchedLoops = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data();

          // Profil resmini ve medya dosyalarını Firebase Storage'dan çekme
          try {
            if (data.profileImage) {
              const profileImageUrl = await getDownloadURL(ref(storage, data.profileImage));
              data.profileImage = profileImageUrl;
            }

            if (data.mediaUrls && data.mediaUrls.length > 0) {
              const mediaUrls = await Promise.all(
                data.mediaUrls.map(async (url) => {
                  const mediaUrl = await getDownloadURL(ref(storage, url));
                  return { uri: mediaUrl, type: url.type };
                })
              );
              data.mediaUrls = mediaUrls;
            }
          } catch (error) {
            console.error('Error fetching media:', error);
          }

          return { id: doc.id, ...data };
        })
      );

      const sortedLoops = fetchedLoops.sort((a, b) => b.timestamp.toDate() - a.timestamp.toDate());
      setLoopss(sortedLoops);
      setLoading(false);  // Loading bittiğinde false olarak ayarlanır
    });

    return () => unsubscribe(); // Bileşen kaldırıldığında dinleyiciyi kaldır.
  };

  useEffect(() => {
    fetchLoops();
  }, []);
  //like,comment actions
  const handleLike = async (loopId) => {
    const currentUser = user.username; // Kullanıcı adını al
    const loopRef = doc(firestore, 'loops', loopId);
  
    const loopDoc = await getDoc(loopRef);
    const loopData = loopDoc.data();
    const likedBy = loopData.likedBy || [];
  
    const isLiked = likedBy.includes(currentUser); // Kullanıcının beğenip beğenmediğini kontrol et
  
    // Beğeniyi güncelle
    let updatedLikedBy;
    if (isLiked) {
      updatedLikedBy = likedBy.filter(username => username !== currentUser);
    } else {
      updatedLikedBy = [...likedBy, currentUser];
    }
  
    await updateDoc(loopRef, {
      likedBy: updatedLikedBy,
      likes: updatedLikedBy.length,
    });
  
    // loopları güncelle
    setLoops(prevLoops => 
      prevLoops.map(loop => 
        loop.id === loopId ? { ...loop, isLiked: !isLiked } : loop
      )
    );
  };
  return (
    <View style={styles.container}>
      {/*loopUrl video bu imagein yerine gelcek*/}
      <Image 
        source={{ uri: 'https://wallpapers.com/images/hd/water-drop-full-screen-hd-deskt-pvrocq06v2mwoh0y.jpg' }} 
        style={styles.video} 
      />
      {/* Üst Çubuk */}
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


      {/* Sağdaki Etkileşim Düğmeleri */}
      <View style={styles.interactionButtons}>
        <TouchableOpacity style={styles.iconContainer}>
          <HeartLoop width={20} height={20} color="white" />
          <Text style={styles.iconText}>4.2k</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <CommentLoop width={20} height={20} color="white" />
          <Text style={styles.iconText}>273</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <SendLoop width={20} height={20} color="white" />
          <Text style={styles.iconText}>48</Text>
          <TouchableOpacity style={styles.moreIcon}>
            <MoreLoop width={18} height={18} color="white" />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
     
      {/* Alt Kısım */}
      <View style={styles.bottomContainer}>
        <Image 
          source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVD8_VSjtgYjnhEZAN5nFgsj3SzXuBwEFr9w&s' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.username}>@berzanoner04</Text>
          <Text style={styles.caption}>selamlar beyler bayanlar, nasılsınız?</Text>
          <View style={styles.locationMusicContainer}>
            <TouchableOpacity style={styles.iconTextBackground}>
              <LocationLoop width={12} height={12} color="white" />
              <Text style={styles.location}>Dubai</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconTextBackground}>
              <MusicLoop width={12} height={12} color="white" />
              <Text style={styles.author}>David G.</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    
  },
  video: {
    position: 'absolute',
    top: 0,
    bottom: -50,
    left: 0,
    right: 0,
    resizeMode: 'cover', // Ekranı kaplaması için
    zIndex:-1,
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  iconBackground: {
    backgroundColor: 'background: rgba(75, 75, 75, 0.2)', // Yarı saydam siyah arka plan
    borderRadius: 20, // Yuvarlak şekil
    padding: 8, // İçerik boşluğu
  },
  iconBackgroundCamera: {
    backgroundColor: 'background: rgba(75, 75, 75, 0.2)', // Yarı saydam siyah arka plan
    borderRadius: 20, // Yuvarlak şekil
    padding: 3, // İçerik boşluğu
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon:{
     marginLeft:5,

  },
  title: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'ms-bold', // Başlıkta kalın font kullanımı
  },
  // image: {
  //   flex: 1,
  //   resizeMode: 'cover',
  // },
  interactionButtons: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    alignItems: 'center',
    backgroundColor: 'background: rgba(0, 0, 0, 0.2);', // Yarı saydam siyah arka plan
    borderRadius: 33, // Yuvarlak köşeler
    paddingVertical: 8, // Dikey dolgu
    paddingHorizontal: 18, // Yatay dolgu
    
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop:10,
  
  },
  moreIcon: {
    marginTop: 8, // SendLoop ikonu altına yerleştirildi
    marginBottom:-5,
  },
  iconText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'ms-regular', // Etkileşim sayılarına regular font
    marginTop: 3,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    marginBottom:45
  },
  username: {
    color: 'white',
    fontFamily: 'ms-bold',
    position:'absolute',
    bottom:30,
  },
  caption: {
    color: 'white',
    fontFamily: 'ms-regular',
    marginTop:10,
  },
  locationMusicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position:'absolute',
    top:40
  },
  iconTextBackground: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75, 75, 75, 0.2)', // Yarı saydam arka plan
    borderRadius: 15, // Yuvarlak köşeler
    paddingVertical: 2, // Dikey dolgu
    paddingHorizontal: 6, // Yatay dolgu
    marginRight: 8, // İki öğe arası boşluk
  },
  location: {
    color: 'white',
    fontFamily: 'ms-light',
    marginLeft: 4,
  },
  author: {
    color: 'white',
    fontFamily: 'ms-regular',
    marginLeft: 4,
  },
});



export default LoopScreen;
