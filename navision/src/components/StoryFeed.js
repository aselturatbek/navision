import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, FlatList } from 'react-native';
import AddIcon from '../assets/icons/AddIcon';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase config dosyasını doğru yerden import et

const StoryFeed = ({ handleStoryPress }) => {
  const [groupedStories, setGroupedStories] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const storiesQuery = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
      const latestStories = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Her kullanıcının sadece en güncel story'sini alıyoruz
        if (!latestStories[data.userId]) {
          latestStories[data.userId] = {
            userId: data.userId,
            profileImage: data.profileImage,
            username: data.username,
            timestamp: data.timestamp,
            mediaUrls: data.mediaUrls, // Medya URL'lerini ekle
          };
        }
      });
      setGroupedStories(Object.values(latestStories)); // Object.entries'den Object.values'a çevirdik
    });

    return () => unsubscribe();
  }, []);

  const handleImageError = (userId) => {
    Alert.alert('Hata', `${userId} kullanıcısının profil resmi yüklenemedi.`);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity key={item.userId} onPress={() => handleStoryPress(item.userId)}>
      <Image
        source={{
          uri: item.profileImage || 'https://via.placeholder.com/150',
        }}
        style={styles.storyImage}
        resizeMode="cover"
        onError={() => handleImageError(item.userId)}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={groupedStories}
      renderItem={renderItem}
      keyExtractor={(item) => item.userId}
      horizontal
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={
        <TouchableOpacity
          style={styles.storyItem}
          onPress={() => navigation.navigate('StoryUpload')}
        >
          <AddIcon />
        </TouchableOpacity>
      }
      contentContainerStyle={styles.storiesContainer}
    />
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
