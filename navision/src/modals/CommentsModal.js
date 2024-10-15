import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';

const CommentsModal = ({ visible, onClose }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    { id: 1, author: 'yasmin', comment: 'Buraya yıllar önce ailemle gitmiştik. Şimdi bunu gördüğümde anılarım aklıma geldi ya...', likes: 43, replies: 11, time: '2 saat önce', image: require('../assets/images/default_cat.jpg') },
    { id: 2, author: 'cihan', comment: 'Bu kadar uzağa gidip de bize haber vermemen üzdü beni. Bir daha ki sefere beraberiz unutma!', likes: 22, replies: 3, time: '1 saat önce', image: require('../assets/images/default_cat.jpg') },
    { id: 3, author: 'furkan', comment: '#keyif diyorsun yani:) iyi eğlenceler kardeşim.', likes: 12, replies: 2, time: '5 dakika önce', image: require('../assets/images/default_cat.jpg') }
  ]);

  const handleCommentSubmit = () => {
    const newCommentData = {
      id: comments.length + 1,
      author: 'You',
      comment: newComment,
      likes: 0,
      replies: 0,
      time: 'Şimdi',
      image: require('../assets/images/default_cat.jpg'),
    };
    setComments([newCommentData, ...comments]);
    setNewComment('');
  };

  const handleGesture = (event) => {
    if (event.nativeEvent.translationY > 100) {
      onClose(); // Close the modal if swipe down exceeds a certain threshold
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <PanGestureHandler onGestureEvent={handleGesture}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.commentsCount}>Yorumlar ({comments.length})</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.filterText}>Filtrele</Text>
              </TouchableOpacity>
            </View>

            {/* Comment Input */}
            <View style={styles.commentInputContainer}>
              <Image source={require('../assets/images/default_cat.jpg')} style={styles.commentUserImage} />
              <TextInput
                style={styles.input}
                placeholder="Yorum ekle"
                value={newComment}
                onChangeText={setNewComment}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={handleCommentSubmit}>
                <Ionicons name="send-outline" size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* Comments List */}
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Image source={item.image} style={styles.commentAuthorImage} />
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{item.author}</Text>
                    <Text style={styles.timestamp}>{item.time}</Text>
                    <Text style={styles.commentText}>{item.comment}</Text>
                    <View style={styles.commentActions}>
                      <View style={styles.actionIcons}>
                        <TouchableOpacity style={styles.iconButton}>
                          <Feather name="heart" size={15} style={styles.icons} />
                          <Text style={styles.actionText}>{item.likes}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                          <Feather name="message-circle" size={15} style={styles.icons} />
                          <Text style={styles.actionText}>{item.replies}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}
            />
          </View>
        </View>
      </PanGestureHandler>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    maxHeight: '70%',
    shadowColor: '#fff',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  commentsCount: {
    fontSize: 16,
    fontFamily:'ms-bold',
    color: '#333',
  },
  filterText: {
    color: '#000000',
    fontFamily:'ms-bold'
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  commentUserImage: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    paddingHorizontal: 10,
    marginRight: 10,
    fontSize: 14,
    fontFamily:'ms-regular'
  },
  commentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  commentAuthorImage: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily:'ms-bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'ms-light',
    color: '#999',
    marginBottom: 5,
  },
  commentText: {
    fontSize: 13,
    fontFamily:'ms-regular',
    color: '#555',
    marginBottom: 5,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  actionIcons: {
    flexDirection: 'row',
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  actionText: {
    color: '#555',
    fontFamily:'ms-light',
    marginLeft: 5,
  },
});

export default CommentsModal;
