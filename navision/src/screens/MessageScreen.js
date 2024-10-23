import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Animated } from 'react-native';
// icons
import SearchChatIcon from '../assets/icons/SearchChatIcon';
import ThreeLineIcon from '../assets/icons/ThreeLine';
//components
import MapComponent from '../components/chatscreen/MapComponent';
import ChatsComponent from '../components/chatscreen/ChatsComponent';
import FabComponent from '../components/chatscreen/FabComponent';

const MessageScreen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useState(new Animated.Value(0))[0];
  return (
    <View style={styles.container}>
      <MapComponent />
      <View style={styles.header}>
        <Text style={styles.title}>Sohbetler</Text>
        <View style={styles.icons}>
          <TouchableOpacity style={styles.icon}>
            <SearchChatIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <ThreeLineIcon  />
          </TouchableOpacity>
        </View>
      </View>
      <ChatsComponent/>
      <FabComponent/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  map: {
    width: Dimensions.get('window').width - 40,
    height: 180,
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: 'hidden',
    marginLeft: 20,
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 27,
    marginTop: 15,
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: 'ms-bold',
    color: 'black',
    marginBottom: 10,
  },
  icons: {
    flexDirection: 'row',
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 10,
  },
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
  fabContainer: {
    position: 'absolute',
    right: 20,
    bottom: 50, // bir tık yukarı alındı
    alignItems: 'center',
  },
  fab: {
    backgroundColor: '#ddd',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    position: 'absolute',
    backgroundColor: '#ddd',
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
});

export default MessageScreen;
