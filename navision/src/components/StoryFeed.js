import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import AddIcon from '../assets/icons/AddIcon';
import { useNavigation } from '@react-navigation/native';
import { collection, onSnapshot, query, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

const StoryFeed = ({ handleStoryPress }) => {
  const [groupedStories, setGroupedStories] = useState([]);
  const [seenStories, setSeenStories] = useState([]);
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
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
    if (!seenStories.includes(storyId) && currentUser) {
      const updatedSeenStories = [...seenStories, storyId];
      setSeenStories(updatedSeenStories);

      const userDocRef = doc(db, 'userInfo', currentUser.uid);
      await setDoc(userDocRef, { seenStories: updatedSeenStories }, { merge: true });
    }
    handleStoryPress(userId);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.storiesContainer}
    >
      <TouchableOpacity
        style={styles.storyItem}
        onPress={() => navigation.navigate('StoryUpload')}
      >
        <AddIcon />
      </TouchableOpacity>
      {groupedStories.map((item) => (
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
                !seenStories.includes(item.id) && styles.newStoryBorder,
              ]}
              resizeMode="cover"
              onError={() => handleImageError(item.userId)}
            />
          </View>
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
    borderColor: '#007BFF',
    borderWidth: 4,
  },
});

export default StoryFeed;
