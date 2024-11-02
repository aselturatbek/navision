import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, FlatList } from 'react-native';
import AddIcon from '../assets/icons/AddIcon';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const StoryFeed = ({ handleStoryPress }) => {
  const [groupedStories, setGroupedStories] = useState([]);
  const [seenStories, setSeenStories] = useState([]); // Görülen story ID'leri
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    // Kullanıcının gördüğü story'leri Firebase'den al
    const fetchSeenStories = async () => {
      if (currentUser) {
        const userDocRef = doc(db, 'userInfo', currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().seenStories) {
          setSeenStories(userDoc.data().seenStories);
        }
      }
    };

    fetchSeenStories();

    const storiesQuery = query(collection(db, 'stories'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(storiesQuery, (snapshot) => {
      const latestStories = {};
      const currentTime = new Date().getTime();
      const twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

      snapshot.forEach((doc) => {
        const data = doc.data();

        // Sadece 24 saat içinde atılan story'leri al
        if (data.timestamp && currentTime - data.timestamp.toMillis() < twentyFourHoursInMillis) {
          if (!latestStories[data.userId]) {
            latestStories[data.userId] = {
              id: doc.id,
              userId: data.userId,
              profileImage: data.profileImage,
              username: data.username,
              timestamp: data.timestamp,
              mediaUrls: data.mediaUrls,
            };
          }
        }
      });

      setGroupedStories(Object.values(latestStories));
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleImageError = (userId) => {
    Alert.alert('Hata', `${userId} kullanıcısının profil resmi yüklenemedi.`);
  };

  const handleStoryPressWrapper = async (userId, storyId) => {
    // Story izleme işlevini sararak story'nin görüldüğünü kaydet
    if (!seenStories.includes(storyId) && currentUser) {
      const updatedSeenStories = [...seenStories, storyId];
      setSeenStories(updatedSeenStories);

      // Firestore'da kullanıcının görülen story'lerini güncelle
      const userDocRef = doc(db, 'userInfo', currentUser.uid);
      await setDoc(userDocRef, { seenStories: updatedSeenStories }, { merge: true });
    }
    handleStoryPress(userId);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={item.userId}
      onPress={() => handleStoryPressWrapper(item.userId, item.id)}
    >
      <View style={styles.storyWrapper}>
        <Image
          source={{
            uri: item.profileImage || 'https://via.placeholder.com/150',
          }}
          style={[
            styles.storyImage,
            !seenStories.includes(item.id) && styles.newStoryBorder, // Görülmemiş story'ye özel stil
          ]}
          resizeMode="cover"
          onError={() => handleImageError(item.userId)}
        />
      </View>
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
  storyWrapper: {
    marginHorizontal: 5,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 33,
    backgroundColor: '#eaeaea',
  },
  newStoryBorder: {
    borderColor: '#007BFF', // Yeni story için turuncu kenarlık
    borderWidth: 4,
  },
});

export default StoryFeed;
