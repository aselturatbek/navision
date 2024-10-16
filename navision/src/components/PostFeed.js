import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Animated,
} from 'react-native';
import SaveIcon from '../assets/icons/SaveIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import CommentIcon from '../assets/icons/CommentIcon';
import SendIcon from '../assets/icons/SendIcon';
import HeartIcon from '../assets/icons/HeartIcon';
import { getFirestore, collection, getDocs,onSnapshot } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Video } from 'expo-av';

const { width: screenWidth } = Dimensions.get('window');

const timeAgo = (timestamp) => {
  const now = new Date();
  const postDate = timestamp.toDate();
  const diffInMs = now - postDate;
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  if (diffInHours < 1) {
    return `${Math.floor(diffInMs / (1000 * 60))}dk önce`;
  } else if (diffInHours < 24) {
    return `${diffInHours}sa önce`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}g önce`;
  }
};


const PostFeed = ({ user, handleCommentPress, handleSharePress }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const firestore = getFirestore();
  const scrollX = useRef(new Animated.Value(0)).current; 

  const fetchPosts = async () => {
    try {
      const querySnapshot = await getDocs(collection(firestore, 'posts'));
      const fetchedPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderMediaItem = ({ item }) => {
    if (!item || !item.uri) return null; // Hatalı item varsa döndürme
  
    if (item.type === 'video') {
      return (
        <Video
          source={{ uri: item.uri }}
          style={styles.mediaVideo} // Aynı media stili
          resizeMode="cover"
          shouldPlay
          isLooping
          muted={false}
        />
      );
    }
  
    return <Image source={{ uri: item.uri }} style={styles.mediaVideo} />;
  };
  
  

  const renderCarousel = (mediaUrls) => (
    <View style={{ position: 'relative' }}>
      <FlatList
        data={mediaUrls}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast" // Hızlı durması için
        snapToAlignment="center" // Slaytların hizalanmasını sağlar
        snapToInterval={screenWidth - 35} 
        renderItem={({ item }) => renderMediaItem({ item })}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.carouselContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />
      <View style={styles.dotsContainer}>
        {mediaUrls.map((_, index) => {
          const inputRange = [
            (index - 1) * screenWidth,
            index * screenWidth,
            (index + 1) * screenWidth,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 16, 8],
            extrapolate: 'clamp',
          });
  
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });
  
          return (
            <Animated.View
              key={index.toString()}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    </View>
  );
  
  

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <View style={styles.mediaWrapper}>
        {item.mediaUrls && item.mediaUrls.length > 1
          ? renderCarousel(item.mediaUrls)
          : renderMediaItem({ item: item.mediaUrls?.[0] })}
      </View>
  
      <TouchableOpacity style={styles.saveIconContainer}>
        <SaveIcon />
      </TouchableOpacity>
  
      <View style={styles.postInfo}>
        <View style={styles.icon2ColumnRow}>
          <View style={styles.locationRow}>
            <LocationIcon />
            <View style={styles.locationContainer}>
              <Text style={styles.location}>
                {`${item.location?.city || ''}, ${item.location?.country || ''}`}
              </Text>
            </View>
          </View>
          <View style={styles.authorRow}>
            <Image
              source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }}
              style={styles.authorImage}
            />
            <Text style={styles.authorTextContainer}>
              <Text style={styles.postAuthor}>
                {`${item.name} ${item.surname}`}
              </Text>
              <Text style={styles.timestampText}>
                {` • ${timeAgo(item.timestamp)}`}
              </Text>
            </Text>
          </View>
          <Text style={styles.postDescription}>{item.description}</Text>
        </View>
  
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.button}>
            <HeartIcon />
            <Text style={styles.countText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleCommentPress}>
            <CommentIcon />
            <Text style={styles.countText}>{item.comments}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSharePress}>
            <SendIcon />
            <Text style={styles.countText}>{item.shares}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  
  
  

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainer}
    />
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginVertical: 15,
    paddingHorizontal: 18,
  },
  saveIconContainer: {
    position: 'absolute',
    top: 20,
    right: 40,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 20,
    padding: 12,
    zIndex: 1,
  },
  mediaWrapper: {
    width: screenWidth - 35,
    height: 370,
    borderRadius: 30,
    overflow: 'hidden', // Medya taşmasını önlemek için
    marginBottom: 10, 
    alignSelf: 'center', // Ortaya hizalama
  },
  media: {
    width: '100%',
    height: '100%',
  },
  mediaVideo: {
    width: screenWidth - 36,
    height: 370,
    borderRadius: 30,
    marginRight: 0,
  },
  
  postInfo: {
    padding: 15,
    backgroundColor: '#33414f',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderRadius:30,
    marginTop: -60,
    height: 'auto',
    zIndex:-1,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 15, // Fotoğrafın hemen altına yerleştirmek için
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10, // Dotsları en üst katmana alır
    elevation: 10, // Android için katman sıralaması
  
    paddingVertical: 5, // Dotsların çevresine boşluk
    borderRadius: 10, // Hafif yuvarlatılmış görünüm
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff', // Dotslar için beyaz renk
    marginHorizontal: 4,
  },
  icon2ColumnRow: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 4,
    marginTop: 50,
    position: 'relative', // Ana kapsayıcı pozisyonu
  },
  locationContainer: {
    position: 'absolute', // Metni bağımsız olarak konumlandırmak için
    top: 3, // Yukarı taşıma
    left: 29, // Sola taşıma
  },
  location: {
    fontSize: 12,
    color: '#fff',
    fontFamily: 'ms-bold',
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  authorImage: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 8,
  },
  postAuthor: {
    fontSize: 11,
    color: '#fff',
    fontFamily:'ms-bold',
    marginLeft:2
  },
  timestampText: {
    fontSize: 10,
    color: '#bbb', // Hafif gri renkte timestamp
    fontFamily: 'ms-regular',
    marginTop: 2,
  },
  postDescription: {
    fontSize: 11,
    color: '#fff',
    marginTop: -3,
    marginLeft: 32,
    fontFamily:'ms-regular'
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -70,
    marginRight: -10,
  },
  button: {
    width: 43,
    height: 55,
    backgroundColor: '#293440',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop:20,
    // shadow
    shadowColor: '#fff', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 4.65, 
    elevation: 8, 
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    fontFamily:'ms-regular'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  carouselContainer: {
    marginBottom: 15,
  },
});

export default PostFeed;
