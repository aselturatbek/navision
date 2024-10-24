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
    console.log("Tıklanan kullanıcının userId'si:", item.userId); // userId'yi konsola yazdır
    navigation.navigate('ChatScreen', { user: item }); // Sonra ChatScreen'e geçiş yap
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
        </View>
      </View>
      <View style={styles.shortDivider} />
    </TouchableOpacity>
  );
};

const ChatsComponent = () => {
  const [users, setUsers] = useState([]);

  // Firestore'dan kullanıcıları ve sohbet bilgilerini anlık olarak çekme fonksiyonu
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
  
        for (const chatDoc of snapshot.docs) {
          const chatData = chatDoc.data();
          const otherUsers = chatData.users.filter(userId => userId !== currentUser.uid);
  
          for (const otherUserId of otherUsers) {
            if (usersList[otherUserId]) continue;
  
            const userRef = doc(db, 'userInfo', otherUserId);
            const userSnapshot = await getDoc(userRef);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              usersList[otherUserId] = {
                id: otherUserId,
                userId: otherUserId,
                username: userData.username,
                profileImage: userData.profileImage || defaultProfileImage,
                message: chatData.lastMessage || '',
                time: chatData.lastMessageTimestamp 
                  ? chatData.lastMessageTimestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : '',
                lastMessageTimestamp: chatData.lastMessageTimestamp || null, // Sıralama için saklanıyor
              };
            }
          }
        }
  
        // Kullanıcıları `lastMessageTimestamp`'e göre sıralıyoruz
        const sortedUsers = Object.values(usersList).sort((a, b) => {
          if (!a.lastMessageTimestamp) return 1;
          if (!b.lastMessageTimestamp) return -1;
          return b.lastMessageTimestamp.toMillis() - a.lastMessageTimestamp.toMillis(); // Zaman damgasına göre sıralama
        });
  
        setUsers(sortedUsers); // Sıralanmış kullanıcı listesini güncelliyoruz
      });
  
      return () => unsubscribe();
    } catch (error) {
      console.error('Kullanıcılar alınırken hata:', error);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <FlatList
      data={users}
      renderItem={({ item }) => <ChatItem item={item} />}
      keyExtractor={item => item.id} // Benzersiz key olarak userId kullanılıyor
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
