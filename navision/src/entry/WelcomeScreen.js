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
      

      <Text style={styles.title}>Hayalindeki tatili</Text>
      <Text style={styles.subtitle}>tek tıkla planla,{"\n"} gez & paylaş.</Text>

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
    fontSize: 33,
    fontFamily: 'ms-light',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 30,
    fontFamily: 'ms-bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop:20,
    width:250,
    height:50,
    alignItems:'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'ms-bold',
  },
});

export default WelcomeScreen;
