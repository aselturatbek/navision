import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/images/logo/navision_black.png')}
        style={styles.logo}
      />
       <View style={styles.footer}>
       <Text style={styles.footerText}>test</Text>
        <Image
          source={require('../assets/images/logo/ellusion_text.png')}
          style={styles.footerLogo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  footer: {
    position: 'absolute',
    bottom: -10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  footerLogo: {
    width: 150,
    height: 150,
  },
  footerText: {
    fontFamily: 'ms-light',
    fontSize: 12,
    color: 'grey',
    marginBottom: -65, 
    marginRight: -20
  },
});

export default SplashScreen;
