import React from 'react';
import { View, Text, FlatList, Image, StyleSheet, Dimensions } from 'react-native';

const chats = [
  { id: '1', name: 'Esther Howard', message: 'Dubai tatili için rota oluşturdu.', time: '01:21', profileImage: 'https://via.placeholder.com/150', unreadMessages: 2 },
  { id: '2', name: 'Kristin Watson', message: 'Akşam ne yapıyoruz?', time: '01:29', profileImage: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Yazlık Ailesi', message: 'Ben bu tayfayla kahve içelim ya...', time: '01:40', profileImage: 'https://via.placeholder.com/150', group: true, unreadMessages: 9 },
  { id: '4', name: 'Andrea Pales', message: 'Güzel fikir Berzan!', time: '01:29', profileImage: 'https://via.placeholder.com/150' },
  { id: '5', name: 'Aslı Dorukhan', message: 'Tamamdır.', time: '01:29', profileImage: 'https://via.placeholder.com/150' },
  { id: '6', name: 'Jenny Leo', message: 'Sen de düşünüyorsun bu konu...', time: '01:45', profileImage: 'https://via.placeholder.com/150' },
];

const ChatItem = ({ item }) => {
  return (
    <View>
      <View style={styles.chatItem}>
        <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
        <View style={styles.chatDetails}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{item.name}</Text>
          </View>
          <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
        </View>
        <View style={styles.timeBadgeContainer}>
          <Text style={styles.chatTime}>{item.time}</Text>
          {item.unreadMessages && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadMessages}</Text>
            </View>
          )}
        </View>
      </View>
      <View style={styles.shortDivider} />
    </View>
  );
};

const ChatsComponent = () => {
  return (
    <FlatList
      data={chats}
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
  chatMessage: {
    fontFamily: 'ms-regular',
    fontSize: 13,
    color: '#666',
  },
  timeBadgeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    flexDirection: 'column',
    marginRight: -20,
  },
  chatTime: {
    fontFamily: 'ms-regular',
    fontSize: 12,
    color: '#999',
    marginBottom: 3,
  },
  unreadBadge: {
    backgroundColor: '#007BFF',
    borderRadius: 12,
    paddingVertical: 1,
    paddingHorizontal: 5,
    marginTop: 3,
  },
  unreadText: {
    color: '#fff',
    fontSize: 13,
    fontFamily: 'ms-regular',
  },
});

export default ChatsComponent;
