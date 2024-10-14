import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = getAuth();
  const firestore = getFirestore();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        Alert.alert("Hata", "Lütfen e-posta adresinizi doğrulayın.");
        return;
      }

      // Firestore'dan kullanıcı bilgilerini al
      const userDoc = await getDoc(doc(firestore, 'userInfo', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const username = userData.username; // Kullanıcı adını al
        Alert.alert('Giriş başarılı!', `Hoş geldin, ${username}`);
        navigation.replace('HomeTabs', { username });
      } else {
        Alert.alert('Kullanıcı bilgileri bulunamadı');
      }
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert("Hata", "Lütfen e-posta adresinizi girin.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Başarılı", "Şifre sıfırlama linki e-posta adresinize gönderildi.");
    } catch (error) {
      Alert.alert("Hata", error.message);
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
        style={styles.forgotButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.forgotText}>Forgot Password?</Text>
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
    backgroundColor: '#F1F1F2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1995AD',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#A1D6E2',
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
    backgroundColor: '#1995AD',
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
  forgotButton: {
    marginBottom: 20,
  },
  forgotText: {
    color: '#1995AD',
    fontSize: 16,
  },
  registerButton: {
    marginTop: 10,
  },
  registerText: {
    color: '#1995AD',
    fontSize: 16,
  },
});

export default LoginScreen;

