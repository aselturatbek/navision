import React from 'react';
import { View, Text, Image, Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const StoryModal = ({ visible, onClose, stories }) => {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.container}>
        {stories.length > 0 ? (
          stories.map((story) => (
            <View key={story.id} style={styles.storyContainer}>
              <Image source={{ uri: story.profileImage }} style={styles.profileImage} />
              <Text style={styles.username}>{story.username}</Text>
              <Text style={styles.timestamp}>{new Date(story.timestamp?.toDate()).toLocaleString()}</Text>
              <Text style={styles.location}>
                {story.city}, {story.country}
              </Text>
              <Text style={styles.description}>{story.description}</Text>
              {story.mediaUrl && (
                <Image source={{ uri: story.mediaUrl }} style={styles.media} />
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noStoriesText}>Bu kullanıcıya ait hikaye bulunamadı.</Text>
        )}
      </ScrollView>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeButtonText}>Kapat</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  storyContainer: { marginBottom: 20, borderBottomWidth: 1, borderColor: '#ddd', paddingBottom: 10 },
  profileImage: { width: 50, height: 50, borderRadius: 25, marginBottom: 10 },
  username: { fontWeight: 'bold', fontSize: 16 },
  timestamp: { color: '#888', marginBottom: 5 },
  location: { fontSize: 14, marginBottom: 5 },
  description: { fontSize: 16, marginBottom: 10 },
  media: { width: '100%', height: 200, borderRadius: 10 },
  noStoriesText: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#888' },
  closeButton: { alignItems: 'center', padding: 10, backgroundColor: '#4CAF50', borderRadius: 5 },
  closeButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default StoryModal;
