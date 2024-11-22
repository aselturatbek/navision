import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
//api base
import { API_BASE_URL } from '@env';

const Default2Screen = () => {
  return (
   
        <View style={styles.post}>
          <Text style={styles.title}>text</Text>
        </View>
      

  );
};

const styles = StyleSheet.create({
  post: {
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  image: {
    width: '100%', // Görüntüyü tam genişlikte göstermek için
    height: 200,   // Yüksekliği sabit bir boyutta ayarlayın
    borderRadius: 10,
  },
});

export default Default2Screen;
