import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProfileScreen = ({ username, email }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.welcomeText}>Hoş geldin, {username}!</Text>
      <Text style={styles.welcomeText}>Your Email: {email}!</Text>
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
  },
});

export default ProfileScreen;
