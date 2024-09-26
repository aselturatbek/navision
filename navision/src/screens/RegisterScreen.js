import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { auth, database } from '../firebase'; // Firebase konfigürasyonunu içe aktar
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database'; // Realtime Database işlemleri için içe aktar

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Confirm password state ekledik
  const [username, setUsername] = useState('');

  const handleRegister = () => {
    if (password !== confirmPassword) { // Parolaların eşleşip eşleşmediğini kontrol et
      Alert.alert('Hata', 'Parolalar uyuşmuyor!');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Kayıt başarılı, kullanıcı bilgilerini al
        const user = userCredential.user;

        // Kullanıcı bilgilerini Realtime Database'e kaydet
        set(ref(database, 'users/' + user.uid), {
          username: username,
          email: email,
        });

        Alert.alert('Kayıt başarılı!');
        navigation.replace('HomeTabs'); // Kayıt başarılıysa HomeTabs'a geç
      })
      .catch(error => {
        Alert.alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#333"
      />

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
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor="#333"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.loginText}>Already have an account? Login</Text>
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
  loginButton: {
    marginTop: 10,
  },
  loginText: {
    color: '#1995AD', // Login metin rengi
    fontSize: 16,
  },
});

export default RegisterScreen;
