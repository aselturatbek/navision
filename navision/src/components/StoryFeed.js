// components/StoryList.js
import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AddIcon from '../assets/icons/AddIcon';
import { useNavigation } from '@react-navigation/native';

const StoryFeed = ({ groupedStories, handleStoryPress }) => {
  const navigation = useNavigation();

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
      <TouchableOpacity style={styles.storyItem} onPress={() => navigation.navigate('StoryUpload')}>
        <AddIcon />
      </TouchableOpacity>
      {Object.keys(groupedStories).map((userId) => (
        <TouchableOpacity key={userId} onPress={() => handleStoryPress(userId)}>
          <Image
            source={{ uri: groupedStories[userId].profileImage || 'https://via.placeholder.com/150' }}
            style={styles.storyImage}
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
  },
});

export default StoryFeed;
