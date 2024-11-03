import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { db } from '../../firebase'; // Firestore bağlantısı
import { getAuth } from 'firebase/auth'; // Oturum açmış kullanıcıyı almak için
import { query, where, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Navigation

// Varsayılan profil resmi URL'si
const defaultProfileImage = 'https://via.placeholder.com/150';

const ChatItem = ({ item }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('ChatScreen', { user: item });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.chatItem}>
        <Image source={{ uri: item.profileImage || defaultProfileImage }} style={styles.profileImage} />
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.username}</Text>
            <Text style={styles.chatTime}>{item.time}</Text>
          </View>
          <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
          {/* Okunmamış mesaj göstergesi */}
          {item.hasUnreadMessage && <View style={styles.unreadIndicator} />}
        </View>
      </View>
      <View style={styles.shortDivider} />
    </TouchableOpacity>
  );
};

const ChatsComponent = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('Kullanıcı oturum açmamış.');
        return;
      }
  
      const chatsRef = collection(db, 'chats');
      const q = query(chatsRef, where('users', 'array-contains', currentUser.uid));
  
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const usersList = {};
  
        // Tüm getDoc işlemlerini beklemek için Promise.all kullanıyoruz
        await Promise.all(snapshot.docs.map(async (chatDoc) => {
          const chatData = chatDoc.data();
        
  
          const otherUsers = chatData.users.filter(userId => userId !== currentUser.uid);
  
          for (const otherUserId of otherUsers) {
            if (usersList[otherUserId]) continue;
  
            const userRef = doc(db, 'userInfo', otherUserId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
  
              const hasUnreadMessage = chatData.unreadMessages > 0 && chatData.lastMessageSender !== currentUser.uid;
  
              usersList[otherUserId] = {
                id: otherUserId,
                userId: otherUserId,
                username: userData.username,
                profileImage: userData.profileImage || defaultProfileImage,
                message: chatData.lastMessage || '',
                time: chatData.lastMessageTimestamp 
                  ? chatData.lastMessageTimestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : '',
                hasUnreadMessage,
                lastMessageTimestamp: chatData.lastMessageTimestamp || null,
              };
            }
          }
        }));
  
        // Tüm işlemler tamamlandıktan sonra kullanıcıları sıralayıp güncelliyoruz
        const sortedUsers = Object.values(usersList).sort((a, b) => {
          if (!a.lastMessageTimestamp) return 1;
          if (!b.lastMessageTimestamp) return -1;
          return b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis();
        });
  
        setUsers(sortedUsers);
        
      });
  
      return () => unsubscribe();
    } catch (error) {
      console.error('Kullanıcılar alınırken hata:', error);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const renderItem = ({ item }) => {
    return <ChatItem item={item} />;
  };
  
  return (
    <FlatList
      data={users}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  );
  
};

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
    width: Dimensions.get('window').width - 40,
    marginLeft: 8,
  },
  unreadIndicator: {
    width:18,
    height:18,
    borderRadius: 9,
    backgroundColor: '#007BFF',
    position: 'absolute',
    top: 17,
    right: -12,
  },
  shortDivider: {
    height: 1,
    backgroundColor: '#eee',
    width: 240,
    alignSelf: 'center',
    marginLeft: 25,
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    marginRight: 15,
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontFamily: 'ms-bold',
    fontSize: 14,
    color: 'black',
  },
  chatTime: {
    fontFamily: 'ms-regular',
    fontSize: 12,
    color: '#999',
    marginRight:-18
  },
  chatMessage: {
    fontFamily: 'ms-regular',
    fontSize: 13,
    color: '#666',
  },
});

export default ChatsComponent;
