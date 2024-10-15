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
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { Video } from 'expo-av';

const { width: screenWidth } = Dimensions.get('window');

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
    if (!item) return null;
    if (item.type === 'video') {
      return (
        <Video
          source={{ uri: item.uri }}
          style={styles.media}
          resizeMode="cover"
          shouldPlay
          isLooping
          muted={false}
        />
      );
    }
    return <Image source={{ uri: item.uri }} style={styles.media} />;
  };

  const renderCarousel = (mediaUrls) => (
    <View>
      <FlatList
        data={mediaUrls}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
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
          return <Animated.View key={index} style={[styles.dot, { width: dotWidth }]} />;
        })}
      </View>
    </View>
  );

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      {item.mediaUrls && item.mediaUrls.length > 1
        ? renderCarousel(item.mediaUrls)
        : renderMediaItem({ item: item.mediaUrls?.[0] })}

      <TouchableOpacity style={styles.saveIconContainer}>
        <SaveIcon />
      </TouchableOpacity>

      <View style={styles.postInfo}>
        <View style={styles.icon2ColumnRow}>
          <View style={styles.locationRow}>
            <LocationIcon />
            <Text style={styles.location}>
              {`${item.location?.city || ''}, ${item.location?.country || ''}`}
            </Text>
          </View>
          <View style={styles.authorRow}>
            <Image
              source={{ uri: item.profileImage || 'https://via.placeholder.com/150' }}
              style={styles.authorImage}
            />
            <Text style={styles.postAuthor}>
              {`${item.name} ${item.surname}`}
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    padding: 12,
    zIndex: 1,
  },
  media: {
    width: screenWidth - 40,
    height: 370,
    borderRadius: 30,
    marginRight: 10,
  },
  postInfo: {
    padding: 15,
    backgroundColor: '#33414f',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginTop: -30,
    height: 150,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3897f0',
    marginHorizontal: 4,
  },
  icon2ColumnRow: {
    marginBottom: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginLeft: 4,
    marginTop: 10,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  authorImage: {
    width: 25,
    height: 25,
    borderRadius: 25,
    marginRight: 8,
  },
  location: {
    fontSize: 13,
    color: '#fff',
    marginTop: 22,
    marginLeft: 13,
  },
  postAuthor: {
    fontSize: 11,
    color: '#fff',
  },
  postDescription: {
    fontSize: 9,
    color: '#fff',
    marginTop: -5,
    marginLeft: 34,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: -70,
    marginRight: -10,
  },
  button: {
    width: 47,
    height: 61,
    backgroundColor: '#293440',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  countText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
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
