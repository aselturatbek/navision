import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert('Hata', 'Lütfen e-posta adresinizi doğrulayın.');
        return;
      }

      Alert.alert('Giriş Başarılı', 'Hoş Geldin!');
      navigation.replace('HomeTabs');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Başarılı', 'Şifre sıfırlama linki gönderildi.');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <View style={styles.container}>
       <Text style={styles.title}>
              navision’a {"\n"}
              <Text style={styles.title2}>
               Giriş Yap.
              </Text>
       </Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="ornek@gmail.com"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="şifre giriniz"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Giriş Yap</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotText}>Şifreni mi unuttun? <Text style={styles.linkText}>Tıkla</Text></Text>
      </TouchableOpacity>

      <Text style={styles.orText}>ya da</Text>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerText}>Hesabın mı yok? <Text style={styles.linkText}>Hemen Oluştur.</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    marginTop:20,
    fontFamily:'ms-bold'
  },
  title2: {
    fontSize: 33,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily:'ms-light'
  },
  inputContainer: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    fontFamily:'ms-regular'
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontFamily:'ms-regular'
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 15,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  labelText:{
    fontFamily:'ms-bold',
    marginBottom:8
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'ms-bold'
  },
  forgotText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
    color: '#555',
    fontFamily:'ms-regular'
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 14,
    color: '#777',
    fontFamily:'ms-light'
  },
  registerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
    fontFamily:'ms-regular'
  },
  linkText: {
    color: '#007BFF',
    fontWeight: 'bold',
    fontFamily:'ms-bold'
  },
});

export default LoginScreen;
