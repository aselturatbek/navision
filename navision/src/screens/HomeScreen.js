import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomeScreen = ({ username }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hoş geldin, {username}!</Text>
      {/* Diğer içerikler buraya gelecek */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F2',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1995AD',
    fontFamily:'ms-regular',
  },
});

export default HomeScreen;
