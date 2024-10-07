import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StoryModal = ({ visible, onClose }) => {
  // Example data
  const profileImage = 'https://example.com/profile.jpg'; // Replace with an actual image URL
  const username = 'john_doe';
  const timestamp = '2 hours ago';
  const location = 'Istanbul, Turkey';
  const description = 'Enjoying a beautiful sunset at the beach!';

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Full-screen Media Preview */}
        <View style={styles.mediaPreview}>
          <Image 
            source={{ uri: 'https://example.com/story-image.jpg' }} 
            style={styles.media} 
            resizeMode="cover" 
          />
        </View>

        {/* Overlaying Header with Profile Info */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{username}</Text>
              <Text style={styles.timestamp}>{timestamp} • {location}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>

        {/* Description at the bottom */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)', // A darker background for the full-screen effect
    justifyContent: 'space-between',
  },
  mediaPreview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flexDirection: 'column',
  },
  username: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  timestamp: {
    color: 'gray',
    fontSize: 12,
  },
  descriptionContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  description: {
    color: 'white',
    fontSize: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background for readability
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
  },
});

export default StoryModal;
