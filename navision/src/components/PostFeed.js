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
import SaveIcon from '../assets/icons/SaveIcon';
import LocationIcon from '../assets/icons/LocationIcon';
import CommentIcon from '../assets/icons/CommentIcon';
import SendIcon from '../assets/icons/SendIcon';
import HeartIcon from '../assets/icons/HeartIcon';
//expo
import { Video } from 'expo-av';
//axios
import axios from 'axios';
//apibaseurl
import { API_BASE_URL } from '@env'; 
//secure store
import * as SecureStore from 'expo-secure-store';


const { width: screenWidth } = Dimensions.get('window');


const timeAgo = (timestamp) => {
  if (!timestamp || !(timestamp instanceof Date) || isNaN(timestamp.getTime())) {
    return 'Geçersiz tarih'; // Hatalı veya geçersiz tarih
  }

  const now = new Date();
  const diffInMs = now - timestamp;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInMinutes < 1) {
    return 'Şimdi';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}dk önce`;
  } else if (diffInMinutes < 1440) { // 24 saat
    const diffInHours = Math.floor(diffInMinutes / 60);
    return `${diffInHours}sa önce`;
  } else if (diffInMinutes < 10080) { // 7 gün
    const diffInDays = Math.floor(diffInMinutes / 1440); // 1440 dakika = 1 gün
    return `${diffInDays}g önce`;
  } else if (diffInMinutes < 40320) { // 4 hafta
    const diffInWeeks = Math.floor(diffInMinutes / 10080); // 10080 dakika = 1 hafta
    return `${diffInWeeks}h önce`;
  } else {
    const diffInMonths = Math.floor(diffInMinutes / 40320); // 40320 dakika = 1 ay
    return `${diffInMonths}ay önce`;
  }
};



const PostFeed = ({ user, handleCommentPress, handleSharePress }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    console.log('User prop in PostFeed:', user);
  }, [user]);
  
  

  // Postları dinlemek ve güncellemek için onSnapshot kullanıyoruz.
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/posts`);
      const formattedPosts = response.data.map((post) => {
        if (post.timestamp && post.timestamp._seconds) {
          post.timestamp = new Date(post.timestamp._seconds * 1000); // Firestore Timestamp'i Date'e çevir
        } else if (typeof post.timestamp === 'string' || typeof post.timestamp === 'number') {
          post.timestamp = new Date(post.timestamp); // String veya Unix Timestamp ise Date'e çevir
        } else {
          console.warn('Invalid timestamp format:', post.timestamp);
          post.timestamp = null; // Geçersiz timestamp için null ata
        }
        return post;
      });
      setPosts(formattedPosts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setLoading(false);
    }
  };
  
  
  useEffect(() => {
    fetchPosts();
  }, []);
  

  useEffect(() => {
    fetchPosts();
  }, []);
  
  const handleLike = async (postId) => {
    try {
      const token = await SecureStore.getItemAsync('accessToken'); // Access token alın
      if (!token) {
        console.error('Access token bulunamadı.');
        return;
      }
  
      const response = await axios.post(
        `${API_BASE_URL}/api/posts/like`,
        { postId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      const { likes, likedBy } = response.data;
  
      // Postu güncelle
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes, likedBy } : post
        )
      );
    } catch (error) {
      console.error('Error liking post:', error.response?.data || error.message);
    }
  };
  
  
  const renderMediaItem = ({ item }) => {
    if (!item) return null; // Hatalı item varsa döndürme

    const uri = typeof item === 'string' ? item : item.uri;

    if (item.type === 'video') {
        return (
            <Video
                source={{ uri }}
                style={styles.mediaVideo}
                resizeMode="cover"
                shouldPlay
                isLooping
                muted={false}
            />
        );
    }

    return <Image source={{ uri }} style={styles.mediaVideo} />;
};

  
  
  

  const renderCarousel = (mediaUrls) => (
    <View style={{ position: 'relative' }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="center"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        contentContainerStyle={styles.carouselContainer}
      >
        {mediaUrls.map((item, index) => (
          <View key={index.toString()}>{renderMediaItem({ item })}</View>
        ))}
      </ScrollView>
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
      {Array.isArray(item.mediaUrls) && item.mediaUrls.length > 1
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
                {`${item.username} `}
              </Text>
              <Text style={styles.timestampText}>
              {` • ${timeAgo(item.timestamp)}`}
              </Text>
            </Text>
          </View>
          <Text style={styles.postDescription}>{item.description}</Text>
        </View>
  
        <View style={styles.iconRow}>
        <TouchableOpacity style={styles.button} onPress={() => handleLike(item.id)}>
        <HeartIcon color={item.likedBy?.includes(user.username) ? 'red' : 'white'} />
        <Text style={styles.countText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleCommentPress(item.id)}>
            <CommentIcon />
            <Text style={styles.countText}>{item.commentsCount}</Text>
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
    backgroundColor: 'rgba(255,255,255,0.6)',
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
    marginLeft:2,
    
  },
  timestampText: {
    fontSize: 10,
    color: '#bbb', // Hafif gri renkte timestamp
    fontFamily: 'ms-regular',
    marginTop: 2,
  },
  postDescription: {
    fontSize: 10,
    color: '#fff',
    marginTop: -3,
    marginLeft: 32,
    fontFamily: 'ms-regular',
    maxWidth: screenWidth - 240, // Metnin taşmaması için genişlik sınırlaması
    lineHeight: 14, // Yazıyı sıkıştırarak daha okunabilir hale getirmek için
    flexWrap: 'wrap', // Yazıyı sarmalayıp birden fazla satıra yaymak
  },
  
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -70,
    marginRight: -12,
  },
  button: {
    width: 43,
    height: 55,
    backgroundColor: '#293440',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
    marginBottom:10,
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
