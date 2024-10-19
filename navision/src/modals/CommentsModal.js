import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const formatTimeAgo = (timestamp) => {
  // Eğer timestamp bir Firestore timestamp nesnesi ise, Date objesine dönüştür
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  
  const now = new Date();
  const diffInMs = now - date; // Şimdi ile tarih arasındaki fark
  const diffInSeconds = Math.floor(diffInMs / 1000);

  if (diffInSeconds < 60) {
    return `${diffInSeconds} saniye önce`;
  } else if (diffInSeconds < 3600) {
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    return `${diffInMinutes} dakika önce`;
  } else if (diffInSeconds < 86400) {
    const diffInHours = Math.floor(diffInSeconds / 3600);
    return `${diffInHours} saat önce`;
  } else {
    const diffInDays = Math.floor(diffInSeconds / 86400);
    return `${diffInDays} gün önce`;
  }
};
const CommentsModal = ({ visible, onClose, postId, user }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const firestore = getFirestore();

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user) return;

    const newCommentData = {
      username: user.username || 'username',
      profileImage: user.profileImage || 'https://via.placeholder.com/150',
      comment: newComment,
      timestamp: new Date(), // Timestamps for Firestore
      likes: 0,
      replies: 0,
      repliedBy: [],
    };

    try {
      await updateDoc(doc(firestore, 'posts', postId), {
        commentedBy: arrayUnion(newCommentData),
        comments: arrayUnion(newCommentData),
        commentsCount: (await getDoc(doc(firestore, 'posts', postId))).data().commentsCount + 1,
      });
      // Yorumları anında güncelle
      setComments(prevComments => [newCommentData, ...prevComments]); 
      setNewComment('');
    } catch (error) {
      console.error('Yorum eklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleCommentDelete = async (comment) => {
    try {
      await updateDoc(doc(firestore, 'posts', postId), {
        commentedBy: arrayRemove(comment),
        comments: arrayRemove(comment),
        commentsCount: (await getDoc(doc(firestore, 'posts', postId))).data().commentsCount - 1,
      });
      // Yorum silindikten sonra listeyi güncelle
      setComments(prevComments => prevComments.filter(c => c.comment !== comment.comment)); 
      Alert.alert('Başarılı', 'Yorum silindi.');
    } catch (error) {
      console.error('Yorum silinirken hata oluştu:', error);
      Alert.alert('Hata', 'Yorum silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      const postRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const data = postDoc.data();
        // Yorumları ters sırada ayarlama
        setComments(data.commentedBy || []);
      } else {
        console.error(`Post with ID ${postId} does not exist.`);
        Alert.alert('Hata', 'Bu gönderi mevcut değil.');
      }
    };

    if (visible) {
      fetchComments();
    }
  }, [visible, postId, firestore]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.commentsCount}>Yorumlar ({comments.length})</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.filterText}>Kapat</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.commentInputContainer}>
            <Image  source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }} style={styles.commentUserImage} />
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

          <FlatList
            data={comments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.commentItem}>
                <Image source={{ uri: item.profileImage }} style={styles.commentAuthorImage} />
                <View style={styles.commentContent}>
                  <Text style={styles.commentAuthor}>{item.username}</Text>
                  <Text style={styles.timestamp}>
                    {formatTimeAgo(item.timestamp)} {/* Tarihi uygun formatta göster */}
                  </Text>
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
                      <TouchableOpacity onPress={() => handleCommentDelete(item)}>
                        <Text style={styles.actionText}>Sil</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          />
        </View>
      </View>
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
    height: 500,
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
    fontFamily: 'ms-bold',
    color: '#333',
  },
  filterText: {
    color: '#000000',
    fontFamily: 'ms-bold',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    fontFamily: 'ms-regular',
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
    fontFamily: 'ms-bold',
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
    fontFamily: 'ms-regular',
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
    fontFamily: 'ms-light',
    marginLeft: 5,
  },
});

export default CommentsModal;
