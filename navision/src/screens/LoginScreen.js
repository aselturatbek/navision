import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth } from '../firebase'; // Firebase konfigürasyonunu içe aktar
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database'; // Firebase Realtime Database'ı ekle

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Kullanıcı adını Firebase Database'den al
      const db = getDatabase();
      const usernameRef = ref(db, 'users/' + user.uid + '/username'); // kullanıcı adı kaydının yolu
      const snapshot = await get(usernameRef);
      

      if (snapshot.exists()) {
        const username = snapshot.val(); // Kullanıcı adını al
        Alert.alert('Giriş başarılı!', `Hoş geldin, ${username}`);
        navigation.replace('HomeTabs', { username }); // Giriş başarılıysa HomeTabs'a geç ve kullanıcı adını geç
      } else {
        Alert.alert('Kullanıcı adı bulunamadı');
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#333"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#333"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Register')}
      >
        <Text style={styles.registerText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#F1F1F2', // Arka plan rengi
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1995AD', // Başlık rengi
    marginBottom: 40,
    fontFamily:'ms-regular'
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#A1D6E2', // Giriş alanlarının rengi
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#1995AD', // Buton rengi
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 10,
  },
  registerText: {
    color: '#1995AD', // Register metin rengi
    fontSize: 16,
  },
});

export default LoginScreen;
