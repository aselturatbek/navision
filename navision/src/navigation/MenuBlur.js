import React from 'react';
import { BlurView } from 'expo-blur';
import { View, StyleSheet } from 'react-native';

const MenuBlur = () => {
  return (
    <View style={styles.container}>
      <View style={styles.blurWrapper}>
        <BlurView intensity={10} style={styles.blurView} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
   
  },
  blurWrapper: {
    width: '100%',
    height: 80,
    overflow: 'hidden',
    zIndex: -10,
  },
  blurView: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: -10,
  },
});

export default MenuBlur;
