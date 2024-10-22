import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <View style={styles.imageRow}>
          <Image source={require('../assets/images/welcomepage/image1.png')} style={styles.image1} />
          <Image source={require('../assets/images/welcomepage/image2.png')} style={styles.image2} />
          <Image source={require('../assets/images/welcomepage/image3.png')} style={styles.image3} />
        </View>
        <View style={styles.imageRow1}>
          <Image source={require('../assets/images/welcomepage/image4.png')} style={styles.image4} />
          <Image source={require('../assets/images/welcomepage/image5.png')} style={styles.image5} />
          <Image source={require('../assets/images/welcomepage/image6.png')} style={styles.image6} />
        </View>
      </View>

      <Text style={styles.title}>Hayalindeki tatili</Text>
      <Text style={styles.subtitle}>tek tıkla planla,{"\n"} gez & paylaş.</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Devam et</Text>
      </TouchableOpacity>
    </View>
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
    width: 400,
    height: 450,
    marginBottom: 60,
    marginRight: 0,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    marginTop: -30,
    overflow: 'hidden',  // Resimlerin dışarı taşmasını engellemek için
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginLeft:-30,
  },
  imageRow1: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 25,
    marginLeft:-30,
  },
  image1: {
    width: 170,
    height: 280,
    borderRadius: 15,
    marginLeft: -80,
    position: 'absolute', // Diğer resimlerden bağımsız konumlandırma
    top: 10, // Konumunu istediğiniz gibi ayarlayabilirsiniz
    left: 10, // İstediğiniz x ekseni pozisyonu
    transform: [{ rotate: '-20deg' }],
  },
  image2: {
    width: 150,
    height: 200,
    borderRadius: 15,
    marginLeft: -5,
    marginTop:-70,
    position: 'absolute', // Diğer resimlerden bağımsız konumlandırma
    top: 60, // Konumunu istediğiniz gibi ayarlayabilirsiniz
    left: 100, // İstediğiniz x ekseni pozisyonu
    transform: [{ rotate: '-20deg' }],
  },
  image3: {
    width: 150,
    height: 280,
    borderRadius: 15,
    position: 'absolute', // Diğer resimlerden bağımsız konumlandırma
    top: -5, // Konumunu istediğiniz gibi ayarlayabilirsiniz
    left: 280, // İstediğiniz x ekseni pozisyonu
    transform: [{ rotate: '-20deg' }],
  },
  image4: {
    width: 170,
    height: 280,
    borderRadius: 15,
    marginLeft: -25,
    marginTop: 80,
    position: 'absolute', // Diğer resimlerden bağımsız konumlandırma
    top: 180, // Konumunu istediğiniz gibi ayarlayabilirsiniz
    left: 50, // İstediğiniz x ekseni pozisyonu
    transform: [{ rotate: '-20deg' }],
  },
  image5: {
    width: 150,
    height: 320,
    borderRadius: 15,
    marginTop: -88,
    position: 'absolute', // Diğer resimlerden bağımsız konumlandırma
    top: 250, // Konumunu istediğiniz gibi ayarlayabilirsiniz
    left: 188, // İstediğiniz x ekseni pozisyonu
    transform: [{ rotate: '-20deg' }],
  },
  image6: {
    width: 170,
    height: 280,
    borderRadius: 15,
    marginTop: 80,
    position: 'absolute', // Diğer resimlerden bağımsız konumlandırma
    top: 163, // Konumunu istediğiniz gibi ayarlayabilirsiniz
    left: 378, // İstediğiniz x ekseni pozisyonu
    transform: [{ rotate: '-20deg' }],
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
    marginTop: 40,
    width: 310,
    height: 45,
    alignItems: 'center',
    alignSelf:'center',
    position:'relative'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'ms-bold',
  },
});

export default WelcomeScreen;
