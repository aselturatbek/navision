import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  const images = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLSX4Q_Qac43Q1GaGYJ0Gk3SAE_r_c7SyXug&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLSX4Q_Qac43Q1GaGYJ0Gk3SAE_r_c7SyXug&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLSX4Q_Qac43Q1GaGYJ0Gk3SAE_r_c7SyXug&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLSX4Q_Qac43Q1GaGYJ0Gk3SAE_r_c7SyXug&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLSX4Q_Qac43Q1GaGYJ0Gk3SAE_r_c7SyXug&s',
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </View>

      <Text style={styles.title}>Hayalindeki tatili</Text>
      <Text style={styles.subtitle}>tek tıkla planla, gez & paylaş.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Devam et</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 15,
    margin: 5,
  },
  title: {
    fontSize: 24,
    fontFamily: 'ms-bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'ms-regular',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'ms-bold',
  },
});

export default WelcomeScreen;
