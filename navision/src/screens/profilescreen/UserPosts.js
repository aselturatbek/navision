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
//icons
import SaveIcon from '../../assets/icons/SaveIcon';
import LocationIcon from '../../assets/icons/LocationIcon';
import CommentIcon from '../../assets/icons/CommentIcon';
import SendIcon from '../../assets/icons/SendIcon';
import HeartIcon from '../../assets/icons/HeartIcon';
import BackIcon from '../../assets/icons/chaticons/BackIcon';
//modals
import CommentsModal from '../../modals/CommentsModal';
import ShareModal from '../../modals/ShareModal';
//firebase
import { getFirestore, collection,orderBy, query, where, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { Video } from 'expo-av';

const { width: screenWidth } = Dimensions.get('window');
const timeAgo = (timestamp) => {
  const now = new Date();
  const postDate = timestamp.toDate();
  const diffInMs = now - postDate;
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

const UserPosts = ({route, navigation, user }) => {
  const { selectedPostId: routeSelectedPostId, userId } = route.params;
  const [posts, setPosts] = useState([]);
  const [focusedPostIndex, setFocusedPostIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const firestore = getFirestore();
  const storage = getStorage();
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null); // FlatList için ref tanımlıyoruz
  const [headerUser, setHeaderUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null); // `selectedPostId` state tanımlandı

  //modals
  const [menuVisible, setMenuVisible] = useState(false);
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);
  const [isShareModalVisible, setIsShareModalVisible] = useState(false);
  const [isStoryModalVisible, setIsStoryModalVisible] = useState(false);

  const handleCommentPress = (postId) => {
    setSelectedPostId(postId); // `postId`'yi güncelleyerek ilgili yorumları açar
    setIsCommentsModalVisible(true); // Yorum modalını açar
  };

  const handleSharePress = () => {
    setIsShareModalVisible(true);
  };
  const closeCommentsModal = () => {
    setIsCommentsModalVisible(false);
  };

  const closeShareModal = () => {
    setIsShareModalVisible(false);
  };
  useEffect(() => {
    const fetchUserData = async () => {
      const userRef = doc(firestore, 'userInfo', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setHeaderUser(userSnap.data());
      } else {
        console.log('Kullanıcı bulunamadı.');
      }
    };
    fetchUserData();
  }, [userId]);
  useEffect(() => {
    if (focusedPostIndex !== null && flatListRef.current) {
      // scroll işlemini biraz geciktiriyoruz
      setTimeout(() => {
        try {
          flatListRef.current.scrollToIndex({
            index: focusedPostIndex,
            animated: true,
            viewPosition: -0.7, // Post'u ekranın ortasında konumlandırmak için
          });
        } catch (error) {
          console.warn("Scrolling to index failed", error); // Hata olursa yakala
        }
      }, 300); // 300 ms gecikme
    }
  }, [focusedPostIndex]);
  
  useEffect(() => {
    const postsQuery = query(
      collection(firestore, 'posts'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc') // timestamp alanına göre azalan sırada sıralama
    );
  
    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const fetchedPosts = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        console.log("Fetched post data:", data); // Gelen veriyi kontrol ediyoruz
        return { id: doc.id, ...data };
      });
  
      setPosts(fetchedPosts);
      setLoading(false);
      setFocusedPostIndex(fetchedPosts.findIndex((post) => post.id === selectedPostId));
    }, (error) => {
      console.error("Error fetching posts: ", error);
      setLoading(false);
    });
  
    return () => unsubscribe();
  }, [userId, selectedPostId]);
  
  const handleLike = async (postId) => {
    if (!user || !user.username) return;

    const currentUser = user.username;
    const postRef = doc(firestore, 'posts', postId);

    const postDoc = await getDoc(postRef);
    const postData = postDoc.data();
    const likedBy = postData.likedBy || [];

    const isLiked = likedBy.includes(currentUser);

    let updatedLikedBy;
    if (isLiked) {
      updatedLikedBy = likedBy.filter(username => username !== currentUser);
    } else {
      updatedLikedBy = [...likedBy, currentUser];
    }

    await updateDoc(postRef, {
      likedBy: updatedLikedBy,
      likes: updatedLikedBy.length,
    });

    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, isLiked: !isLiked } : post
      )
    );
  };

  const renderMediaItem = ({ item }) => {
    if (!item) return null;
  
    if (item.endsWith('.mp4')) { // Video dosyası olup olmadığını kontrol ediyoruz
      return (
        <Video
          source={{ uri: item }}
          style={styles.mediaVideo}
          resizeMode="cover"
          shouldPlay
          isLooping
          muted={false}
        />
      );
    }
  
    return <Image source={{ uri: item }} style={styles.mediaVideo} />;
  };

  const renderCarousel = (mediaUrls) => (
    <View style={{ position: 'relative' }}>
      <FlatList
        data={mediaUrls}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToAlignment="center"
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
            <HeartIcon color={item.likedBy?.includes(user?.username) ? 'red' : 'white'} />
            <Text style={styles.countText}>{item.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleCommentPress(item.id)} >
            <CommentIcon />
            <Text style={styles.countText}>{item.commentsCount}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSharePress} >
            <SendIcon />
            <Text style={styles.countText}>{item.shares}</Text>
          </TouchableOpacity>
        </View>
        <CommentsModal
            visible={isCommentsModalVisible}
            onClose={closeCommentsModal}
            postId={selectedPostId}
            user={user}
          />
          <ShareModal visible={isShareModalVisible} onClose={closeShareModal} />
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
    <View style={{ flex: 1, backgroundColor:'#fff'}}>
   <View style={styles.header}>
  <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
    <BackIcon />
  </TouchableOpacity>
  <View style={styles.headerContent}>
    <Text style={styles.username}>
      {`${headerUser?.username?.toUpperCase() || 'KULLANICI ADI'}`}
    </Text>
    <Text style={styles.subTitle}>Paylaşımlar</Text>
  </View>
</View>
    <FlatList
      ref={flatListRef} // FlatList'e ref ekliyoruz
      data={posts}
      renderItem={renderPost}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.contentContainer}
      getItemLayout={(data, index) => (
        { length: screenWidth, offset: screenWidth * index, index }
      )}
    />
  </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff', // Header arka plan rengi
    marginTop:25,
  },
  backIcon: {
    marginRight: 10,
    marginTop:20,
  },
  headerContent: {
    flexDirection: 'column',
    marginTop:10,
    alignItems:'center',
    marginLeft:110
  },
  username: {
    fontSize: 16,
    color: '#000',
    fontFamily: 'ms-light',
    
  },
  subTitle: {
    fontSize: 14,
    color: '#333', // Alt başlık rengi
    fontFamily: 'ms-bold',
  },
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

export default UserPosts;
