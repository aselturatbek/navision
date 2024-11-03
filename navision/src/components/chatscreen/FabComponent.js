import React, { useState } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { AntDesign, FontAwesome } from '@expo/vector-icons';

// icons
import ReservationIcon from '../../assets/icons/chaticons/Reservation';
import GroupChatIcon from '../../assets/icons/GroupChatIcon';
import ChatMenuIcon from '../../assets/icons/ChatMenuIcon';
import ChatIcon from '../../assets/icons/ChatIcon';
const FabComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const animation = useState(new Animated.Value(0))[0];

  const toggleMenu = () => {
    const toValue = isOpen ? 0 : 1;
    Animated.timing(animation, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsOpen(!isOpen);
  };

  const buttonStyle = (angle, distance) => ({
    transform: [
      {
        scale: animation,
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -Math.cos(angle) * distance], // Pozitif yön (sağ üst)
        }),
      },
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -Math.sin(angle) * distance], // Pozitif yön (aşağı)
        }),
      },
    ],
  });

  return (
    <View style={styles.fabContainer}>
      <Animated.View style={[styles.secondaryButton, buttonStyle(Math.PI / 3, 70)]}>
        <ChatIcon />
      </Animated.View>
      <Animated.View style={[styles.secondaryButton, buttonStyle(Math.PI / 6, 70)]}>
        <GroupChatIcon />
      </Animated.View>
      <Animated.View style={[styles.secondaryButton, buttonStyle(0, 70)]}>
        <ReservationIcon />
      </Animated.View>
      <TouchableOpacity style={styles.fab} onPress={toggleMenu}>
        <ChatMenuIcon />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default FabComponent;
