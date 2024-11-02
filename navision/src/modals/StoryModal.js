import React, { useRef } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const timeAgo = (timestamp) => {
  const now = new Date();
  const postDate = timestamp.toDate();
  const diffInMs = now - postDate;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);

  if (diffInMinutes < 60) {
    return `${diffInMinutes}dk önce`;
  } else if (diffInHours < 24) {
    return `${diffInHours}sa önce`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}g önce`;
  }
};

const StoryModal = ({ visible, onClose, stories }) => {
  const videoRef = useRef(null);

  // 24 saat içinde oluşturulmuş story'leri filtreleme
  const currentTime = new Date().getTime();
  const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

  const filteredStories = stories.filter((story) => {
    const storyTime = story.timestamp.toMillis();
    return currentTime - storyTime < twentyFourHoursInMillis;
  });

  const renderStoryItem = ({ item }) => (
    <View style={styles.storyContainer}>
      <View style={styles.header}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timestamp}>{timeAgo(item.timestamp)}</Text>
        </View>
      </View>

      {item.mediaUrls && item.mediaUrls[0].endsWith('.mp4') ? (
        <Video
          ref={videoRef}
          source={{ uri: item.mediaUrls[0] }}
          style={styles.media}
          resizeMode="cover"
          shouldPlay
          isLooping
          muted={false}
        />
      ) : (
        <Image source={{ uri: item.mediaUrls[0] }} style={styles.media} />
      )}

      <Text style={styles.location}>
        {item.location?.city && item.location?.country
          ? `${item.location.city}, ${item.location.country}`
          : 'Konum bilgisi yok'}
      </Text>

      <Text style={styles.description}>{item.description}</Text>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <FlatList
        data={filteredStories} // Filtrelenmiş story'leri kullanıyoruz
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderStoryItem}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  storyContainer: {
    width: screenWidth,
    height: screenHeight,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontFamily: 'ms-bold',
  },
  timestamp: {
    fontSize: 14,
    color: '#ccc',
    fontFamily: 'ms-light',
  },
  media: {
    width: screenWidth - 40,
    height: screenHeight * 0.6,
    borderRadius: 10,
  },
  location: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'ms-regular',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#fff',
    fontFamily: 'ms-regular',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
  },
});

export default StoryModal;
