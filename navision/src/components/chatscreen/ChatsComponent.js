import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { db } from '../../firebase'; // Firestore bağlantısı
import { collection, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native'; // Navigation
//components
// Varsayılan profil resmi URL'si
const defaultProfileImage = 'https://via.placeholder.com/150';

const ChatItem = ({ item }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('ChatScreen', { user: item })}>
      <View style={styles.chatItem}>
        <Image source={{ uri: item.profileImage || defaultProfileImage }} style={styles.profileImage} />
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.username}</Text>
            <Text style={styles.chatTime}>{item.time}</Text>
          </View>
          <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
        </View>
        {item.unreadMessages > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unreadMessages}</Text>
          </View>
        )}
      </View>
      <View style={styles.shortDivider} />
    </TouchableOpacity>
  );
};

const ChatsComponent = () => {
  const [users, setUsers] = useState([]);

  // Firestore'dan kullanıcıları ve sohbet bilgilerini çekme fonksiyonu
  const fetchUsers = async () => {
    try {
      const userCollection = collection(db, 'userInfo'); // Firestore'daki userInfo koleksiyonu
      const userSnapshot = await getDocs(userCollection);
      const usersList = [];

      for (const doc of userSnapshot.docs) {
        const userData = doc.data();
        
        let profileImage = userData.profileImage || defaultProfileImage;

        usersList.push({
          id: doc.id,
          username: userData.username,
          profileImage: profileImage,
          message: userData.message || 'Henüz mesaj yok',
          time: userData.time || 'N/A',
          unreadMessages: userData.unreadMessages || 0,
        });
      }

      setUsers(usersList);
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
      keyExtractor={item => item.id}
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
  },
  chatMessage: {
    fontFamily: 'ms-regular',
    fontSize: 13,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: 1,
    paddingHorizontal: 5,
    marginLeft: 10,
  },
  unreadText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'ms-regular',
  },
});

export default ChatsComponent;
