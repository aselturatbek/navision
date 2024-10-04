// SideMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SideMenu = ({ onClose }) => {
  return (
    <View style={styles.sideMenu}>
      <Text style={styles.menuTitle}>Menu</Text>
      <TouchableOpacity onPress={onClose}>
        <Text style={styles.closeMenu}>gapaaat</Text>
      </TouchableOpacity>
      {/* Add more menu options here */}
    </View>
  );
};

const styles = StyleSheet.create({
  sideMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 250,
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
    elevation: 5,
  },
  menuTitle: {
    fontSize: 24,
    marginBottom: 20,
  },
  closeMenu: {
    color: 'blue',
    marginTop: 20,
  },
});

export default SideMenu;
