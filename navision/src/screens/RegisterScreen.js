import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { auth, database } from '../firebase'; 
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation(); 
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const checkUsernameExists = async (username) => {
    const usernameRef = ref(database, 'users/');
    const snapshot = await get(usernameRef);
    
    if (snapshot.exists()) {
      const users = snapshot.val();
      return Object.values(users).some(user => user.username === username);
    }
    
    return false;
  };

  const isEmailValid = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isPasswordValid = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return re.test(password);
  };

  const registerUser = async () => {
    try {
      // E-posta geçerliliğini kontrol et
      if (!isEmailValid(email)) {
        Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin.");
        return;
      }

      // Şifre geçerliliğini kontrol et
      if (!isPasswordValid(password)) {
        Alert.alert("Hata", "Şifre en az 8 karakter, 1 büyük harf, 1 rakam ve 1 özel karakter içermelidir.");
        return;
      }

      const usernameExists = await checkUsernameExists(username);
      if (usernameExists) {
        Alert.alert("Hata", "Bu kullanıcı adı zaten alınmış.");
        return;
      }

      if (password === confirmPassword) {
        const newUser = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(newUser.user);
        
        const userId = newUser.user.uid;
        await set(ref(database, 'users/' + userId), {
          username: username,
          phoneNumber: phoneNumber,
          email: email,
        });

        Alert.alert("Başarılı", "Kayıt başarılı! E-posta doğrulama linki gönderildi.", [
          { text: "Tamam", onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert("Hata", "Şifreler uyuşmuyor.");
      }
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Kullanıcı Adı"
        value={username}
        onChangeText={setUsername}
      />
      
      <PhoneInput
        defaultCode="TR"
        layout="first"
        onChangeFormattedText={text => setPhoneNumber(text)}
        withShadow
        autoFocus
        containerStyle={styles.phoneInputContainer}
        textContainerStyle={styles.textContainer}
      />

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Şifreyi Onayla"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      
      <Button title="Kayıt Ol" onPress={registerUser} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  phoneInputContainer: {
    height: 50,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  textContainer: {
    borderRadius: 8,
    backgroundColor: '#fff',
  },
});

export default RegisterScreen;
