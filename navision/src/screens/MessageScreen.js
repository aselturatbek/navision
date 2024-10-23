import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, TextInput } from 'react-native';
// icons
import SearchChatIcon from '../assets/icons/SearchChatIcon';
import ThreeLineIcon from '../assets/icons/ThreeLine';
//components
import MapComponent from '../components/chatscreen/MapComponent';
import ChatsComponent from '../components/chatscreen/ChatsComponent';
import FabComponent from '../components/chatscreen/FabComponent';

const MessageScreen = () => {
  const [searchMode, setSearchMode] = useState(false);  // Arama modu için state
  const animation = useRef(new Animated.Value(0)).current; // Animasyon değeri

  const toggleSearch = () => {
    const toValue = searchMode ? 0 : 1; // Arama moduna göre animasyonu tersine çevir
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: false, // layout değiştiği için native driver false
    }).start();
    setSearchMode(!searchMode); // Arama modunu tersine çevir
  };

  // Başlık ve arama kutusu için opacity ve genişlik animasyonları
  const titleOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const searchBarWidth = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const searchInputOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View style={styles.container}>
      <MapComponent />
      <View style={styles.header}>
        {/* Başlık animasyonu */}
        <Animated.Text style={[styles.title, { opacity: titleOpacity }]}>
          Sohbetler
        </Animated.Text>

        {/* Arama inputu animasyonu */}
        <Animated.View style={[styles.searchContainer, { width: searchBarWidth, opacity: searchInputOpacity }]}>
          <TextInput
            style={styles.searchInput}
            placeholder="Sohbetlerde ara..."
            placeholderTextColor="#888"
          />
        </Animated.View>

        {/* Arama ve menü butonları */}
        <View style={styles.icons}>
          <TouchableOpacity style={styles.icon} onPress={toggleSearch}>
            <SearchChatIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.icon}>
            <ThreeLineIcon />
          </TouchableOpacity>
        </View>
      </View>

      <ChatsComponent />
      <FabComponent />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  searchContainer: {
    position: 'absolute',
    left: -5,
    right:0,
    paddingHorizontal: 27,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 6,
    fontSize: 16,
    fontFamily: 'ms-regular',
    backgroundColor: '#f5f5f5',
  },
  icons: {
    flexDirection: 'row',
    marginHorizontal: 5,
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 10,
  },
});

export default MessageScreen;
