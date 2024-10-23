import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

//icons
import PlusIcon from '../assets/icons/PlusIcon';
import SearchIcon from '../assets/icons/SearchIcon'; 
import ThreeLineIcon from '../assets/icons/ThreeLine'; 
import ChatMenuIcon from '../assets/icons/ChatMenuIcon';
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
    <View style={styles.chatItem}>
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <View style={styles.chatDetails}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={styles.chatTime}>{item.time}</Text>
        </View>
        <Text style={styles.chatMessage} numberOfLines={1}>{item.message}</Text>
      </View>
      {item.unreadMessages && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{item.unreadMessages}</Text>
        </View>
      )}
    </View>
  );
};

const MessageScreen = () => {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker
          coordinate={{
            latitude: 37.78825,
            longitude: -122.4324,
          }}
          title="Current Location"
          description="This is where you are"
        />
      </MapView>
      <View style={styles.header}>
        <Text style={styles.title}>Sohbetler</Text>
        <View style={styles.icons}>
          <TouchableOpacity>
            <SearchIcon width={24} height={24} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <ThreeLineIcon width={24} height={24} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={chats}
        renderItem={({ item }) => <ChatItem item={item} />}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
      <TouchableOpacity style={styles.fab}>
        <ChatMenuIcon style={styles.fabIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    width: Dimensions.get('window').width,
    height: 200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontFamily: 'ms-bold',
    color: 'black',
  },
  icons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  chatName: {
    fontFamily: 'ms-bold',
    fontSize: 16,
    color: 'black',
  },
  chatTime: {
    fontFamily: 'ms-regular',
    fontSize: 14,
    color: '#999',
  },
  chatMessage: {
    fontFamily: 'ms-regular',
    fontSize: 14,
    color: '#666',
  },
  unreadBadge: {
    backgroundColor: '#ff3b30',
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  unreadText: {
    color: 'white',
    fontFamily: 'ms-bold',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#ddd',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fabIcon: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
});

export default MessageScreen;
