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
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
//expo
import { Video } from 'expo-av';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const LoopScreen = ({ navigation }) => {
  const [loops, setLoops] = useState([]);
  const firestore = getFirestore();
  const storage = getStorage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef([]);
  const isFocused = useIsFocused(); // Sayfanın odakta olup olmadığını kontrol etmek için

  const fetchLoops = () => {
    // Koleksiyonu sorgula ve tarihe göre sıralama uygula
    const loopsQuery = query(
      collection(firestore, 'loops'),
      orderBy('timestamp', 'desc') // En yeni gönderiler en üstte
    );
  
    const unsubscribe = onSnapshot(loopsQuery, async (querySnapshot) => {
      try {
        const fetchedLoops = await Promise.all(
          querySnapshot.docs.map(async (doc) => {
            const data = doc.data();
            if (data.loopUrl && data.loopUrl.length > 0) {
              const loopUrls = await Promise.all(
                data.loopUrl.map(async (url) => {
                  const loopUrl = await getDownloadURL(ref(storage, url));
                  return { uri: loopUrl, type: 'video' };
                })
              );
              data.loopUrl = loopUrls.map((urlObj) => urlObj.uri);
            }
            return { id: doc.id, ...data };
          })
        );
  
        // Gönderileri güncelle (sadece `timestamp` alanı mevcut olanları ekler)
        setLoops(
          fetchedLoops
            .filter((loop) => loop.timestamp) // `timestamp` alanı olmayanları hariç tut
            .sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds) // Manuel sıralama
        );
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

  const renderItem = ({ item,index }) => (
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
        <TouchableOpacity style={styles.iconContainer}>
          <HeartLoop width={20} height={20} color="white" />
          <Text style={styles.iconText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <CommentLoop width={20} height={20} color="white" />
          <Text style={styles.iconText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <SendLoop width={20} height={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconContainer}>
          <MoreLoop width={20} height={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Alt Kısım */}
      <View style={styles.bottomContainer}>
        <Image
          source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        <View>
          <Text style={styles.username}>@{item.username}</Text>
          <Text style={styles.caption}>{item.description}</Text>
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
      </View>
    </View>
  );

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
        renderItem={renderItem}
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
  caption: {
    color: 'white',
    marginTop: 5,
    fontSize:12,
    fontFamily:'ms-regular',
    position:'absolute',
    bottom:-7,
    left:0
  },
  locationMusicContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    position:'absolute',
    top:10,
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
