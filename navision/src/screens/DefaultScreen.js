import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DefaultScreen = ({ navigation }) => {
  useEffect(() => {
    // Mesaj sayfasına gelince navigasyonu gizle
    navigation.setOptions({
      tabBarVisible: false, // Bottom Tab gizlenir
      headerShown: false,   // Top header gizlenir
    });

    // Geri dönülürse navigasyonu geri getir
    return () => {
      navigation.setOptions({
        tabBarVisible: true,
        headerShown: true,
      });
    };
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>DEFAULT</Text>
      {/* Mesajlar içeriği buraya eklenecek */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default DefaultScreen;
