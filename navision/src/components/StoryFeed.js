// components/StoryList.js
import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import AddIcon from '../assets/icons/AddIcon';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase config dosyasını doğru yerden import et

const StoryFeed = ({ handleStoryPress }) => {
  const [groupedStories, setGroupedStories] = useState({});
  const navigation = useNavigation();

  // Sadece story atan kullanıcıların son story'leri gösteriliyor
  useEffect(() => {
    const storiesQuery = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
      const latestStories = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Her kullanıcının sadece en güncel story'sini alıyoruz
        if (!latestStories[data.userId]) {
          latestStories[data.userId] = {
            profileImage: data.profileImage,
            username: data.username,
            timestamp: data.timestamp,
          };
        }
      });
      setGroupedStories(latestStories);
    });

    // Component unmount olduğunda listener'ı temizle
    return () => unsubscribe();
  }, []);

  const handleImageError = (userId) => {
    Alert.alert('Hata', `${userId} kullanıcısının profil resmi yüklenemedi.`);
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
      <TouchableOpacity
        style={styles.storyItem}
        onPress={() => navigation.navigate('StoryUpload')}
      >
        <AddIcon />
      </TouchableOpacity>

      {Object.entries(groupedStories).map(([userId, storyData]) => (
        <TouchableOpacity key={userId} onPress={() => handleStoryPress(userId)}>
          <Image
            source={{
              uri: storyData.profileImage || 'https://via.placeholder.com/150',
            }}
            style={styles.storyImage}
            resizeMode="cover"
            onError={() => handleImageError(userId)}
          />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  storiesContainer: {
    paddingVertical: 5,
    paddingHorizontal: 20,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 33,
    marginHorizontal: 5,
    backgroundColor: '#eaeaea',
  },
});

export default StoryFeed;
