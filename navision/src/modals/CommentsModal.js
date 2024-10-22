import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image, Alert } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { getFirestore, doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';

const formatTimeAgo = (timestamp) => {
  const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  const now = new Date();
  const diffInMs = now - date;
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
  const [postOwner, setPostOwner] = useState('');
  const [expandedComment, setExpandedComment] = useState(null);
  const [selectedComment, setSelectedComment] = useState(null); // Seçili yorumu takip eder.
  const firestore = getFirestore();
  const inputRef = useRef(null); // Klavyeyi otomatik açmak için ref

  const handleCommentDelete = async (comment) => {
    if (postOwner === user.username || comment.username === user.username) {
      try {
        const postRef = doc(firestore, 'posts', postId);
        const postDoc = await getDoc(postRef);
        const postData = postDoc.data();

        await updateDoc(postRef, {
          commentedBy: arrayRemove(comment),
          commentsCount: postData.commentsCount - 1,
        });

        setComments((prevComments) => prevComments.filter((c) => c.comment !== comment.comment));
        Alert.alert('Başarılı', 'Yorum silindi.');
      } catch (error) {
        console.error('Yorum silinirken hata oluştu:', error);
        Alert.alert('Hata', 'Yorum silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } else {
      Alert.alert('Hata', 'Yalnızca kendi yorumlarınızı silebilirsiniz.');
    }
  };

  const handleCommentLike = async (comment) => {
    if (!user) return;
    try {
      const postRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postRef);
      const postData = postDoc.data();

      const updatedComments = postData.commentedBy.map((c) => {
        if (c.comment === comment.comment) {
          const alreadyLiked = c.likedBy?.includes(user.username);
          if (alreadyLiked) {
            return {
              ...c,
              likes: c.likes - 1,
              likedBy: c.likedBy.filter((username) => username !== user.username),
            };
          } else {
            return {
              ...c,
              likes: c.likes + 1,
              likedBy: [...(c.likedBy || []), user.username],
            };
          }
        }
        return c;
      });

      await updateDoc(postRef, { commentedBy: updatedComments });
      setComments(updatedComments);
    } catch (error) {
      console.error('Yorumu beğenirken hata oluştu:', error);
      Alert.alert('Hata', 'Yorumu beğenirken bir hata oluştu.');
    }
  };

  const handleReply = (comment) => {
    setSelectedComment(comment.comment); // Seçili yorumu takip et, bu yorum için yanıt girilecek.
    setNewComment(`@${comment.username} `); // Yanıt verirken otomatik olarak kullanıcıyı etiketleyelim.

    // TextInput'a odaklanarak klavyeyi aç
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const submitReplyOrComment = async () => {
    if (!user || !newComment.trim()) return;

    if (selectedComment) {
      // Eğer bir yoruma yanıt veriliyorsa
      const newReply = {
        username: user.username || 'username',
        profileImage: user.profileImage || 'https://via.placeholder.com/150',
        reply: newComment.replace(`@${user.username} `, ''), // Yanıt metnini etiketsiz olarak kaydedelim
        timestamp: new Date(),
      };

      try {
        const postRef = doc(firestore, 'posts', postId);
        const postDoc = await getDoc(postRef);
        const postData = postDoc.data();

        const updatedComments = postData.commentedBy.map((c) => {
          if (c.comment === selectedComment) {
            return {
              ...c,
              repliedBy: [...(c.repliedBy || []), newReply],
              replies: (c.replies || 0) + 1,
            };
          }
          return c;
        });

        await updateDoc(postRef, { commentedBy: updatedComments });
        setComments(updatedComments);
        setNewComment(''); // Yanıtı gönderdikten sonra input'u temizle.
        setSelectedComment(null); // Yanıtlanan yorumu temizle.
      } catch (error) {
        console.error('Yanıt eklenirken hata oluştu:', error);
        Alert.alert('Hata', 'Yanıt eklenirken bir hata oluştu.');
      }
    } else {
      // Eğer direkt bir yorum yazılıyorsa
      const newCommentData = {
        username: user.username || 'username',
        profileImage: user.profileImage || 'https://via.placeholder.com/150',
        comment: newComment,
        timestamp: new Date(),
        likes: 0,
        replies: 0,
        repliedBy: [],
      };

      try {
        const postRef = doc(firestore, 'posts', postId);
        const postDoc = await getDoc(postRef);

        await updateDoc(postRef, {
          commentedBy: arrayUnion(newCommentData),
          commentsCount: postDoc.data().commentsCount + 1,
        });

        setComments((prevComments) => [newCommentData, ...prevComments].sort(sortComments));
        setNewComment('');
      } catch (error) {
        console.error('Yorum eklenirken hata oluştu:', error);
        Alert.alert('Hata', 'Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  const sortComments = (a, b) => {
    if (b.likes === a.likes) {
      return b.timestamp - a.timestamp; // Aynı beğeni sayısı varsa tarihe göre sırala
    }
    return b.likes - a.likes; // Beğeni sayısına göre sırala
  };

  const toggleReplies = (commentId) => {
    setExpandedComment(expandedComment === commentId ? null : commentId);
  };

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      const postRef = doc(firestore, 'posts', postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists()) {
        const data = postDoc.data();
        const sortedComments = (data.commentedBy || []).sort(sortComments); // Yorumları sırala
        setComments(sortedComments);
        setPostOwner(data.owner || '');
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
            <Image source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }} style={styles.commentUserImage} />
            <TextInput
              ref={inputRef} // TextInput için ref ataması
              style={styles.input}
              placeholder="Yorum ekle"
              value={newComment}
              onChangeText={setNewComment}
              returnKeyType="done"
              onSubmitEditing={submitReplyOrComment}
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={submitReplyOrComment}>
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
                    {formatTimeAgo(item.timestamp)}
                  </Text>
                  <Text style={styles.commentText}>{item.comment}</Text>

                  <View style={styles.commentActions}>
                    <View style={styles.actionIcons}>
                      <TouchableOpacity onPress={() => handleCommentLike(item)} style={styles.iconButton}>
                        <Feather name="heart" size={15} style={styles.icons} />
                        <Text style={styles.actionText}>{item.likes}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleReply(item)} style={styles.iconButton}>
                        <Feather name="message-circle" size={15} style={styles.icons} />
                        <Text style={styles.actionText}>{item.replies}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleCommentDelete(item)}>
                        <Text style={styles.actionText}>Sil</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {item.repliedBy.length > 0 && (
                    <TouchableOpacity onPress={() => toggleReplies(item.comment)} style={styles.showRepliesButton}>
                      <Text style={styles.showRepliesText}>
                        {expandedComment === item.comment ? 'Yanıtları Gizle' : `Yanıtları Göster (${item.repliedBy.length})`}
                      </Text>
                    </TouchableOpacity>
                  )}

                  {expandedComment === item.comment && (
                    <View style={styles.repliesContainer}>
                      {item.repliedBy.map((reply, index) => (
                        <View key={index} style={styles.replyItem}>
                          <Text style={styles.replyAuthor}>{reply.username}</Text>
                          <Text style={styles.replyText}>{reply.reply}</Text>
                        </View>
                      ))}
                    </View>
                  )}
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
  showRepliesButton: {
    marginTop: 5,
    paddingHorizontal: 5,
  },
  showRepliesText: {
    color: '#007BFF',
    fontSize: 12,
    fontFamily: 'ms-regular',
  },
  repliesContainer: {
    marginTop: 10,
    paddingLeft: 20,
    borderLeftWidth: 2,
    borderColor: '#ddd',
  },
  replyItem: {
    marginBottom: 10,
  },
  replyAuthor: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'ms-bold',
  },
  replyText: {
    fontSize: 13,
    fontFamily: 'ms-regular',
  },
});

export default CommentsModal;
