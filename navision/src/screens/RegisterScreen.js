import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDocs, collection } from 'firebase/firestore'; 
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = () => {
  const navigation = useNavigation(); 
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState('male');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const firestore = getFirestore(); // Firestore instance

  const checkUsernameExists = async (username) => {
    const snapshot = await getDocs(collection(firestore, 'userInfo'));
    
    return snapshot.docs.some(doc => doc.data().username === username);
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
      if (!isEmailValid(email)) {
        Alert.alert("Hata", "Lütfen geçerli bir e-posta adresi girin.");
        return;
      }

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

        // Firestore'da kullanıcı bilgilerini kaydet
        await setDoc(doc(firestore, 'userInfo', userId), {
          username: username,
          phoneNumber: phoneNumber,
          email: email,
          name: name,
          surname: surname,
          dateOfBirth: dateOfBirth.toISOString().split('T')[0],
          gender: gender,
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

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(false);
    setDateOfBirth(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kayıt Ol</Text>
      
      <View style={styles.inputContainer}>
        <Icon name="person-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Kullanıcı Adı"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      
      <View style={styles.inputContainer}>
        <Icon name="call-outline" size={20} color="#555" />
        <PhoneInput
          defaultCode="TR"
          layout="first"
          onChangeFormattedText={text => setPhoneNumber(text)}
          withShadow
          autoFocus
          containerStyle={styles.phoneInputContainer}
          textContainerStyle={styles.textContainer}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="person" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Ad"
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="person" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Soyad"
          value={surname}
          onChangeText={setSurname}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="mail-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="E-posta"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Şifre"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock-closed-outline" size={20} color="#555" />
        <TextInput
          style={styles.input}
          placeholder="Şifreyi Onayla"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      
      <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
        <Icon name="calendar-outline" size={20} color="#fff" />
        <Text style={styles.datePickerButtonText}>Doğum Tarihini Seç</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {dateOfBirth && (
        <Text style={styles.dateDisplay}>
          Seçilen Doğum Tarihi: {dateOfBirth.toLocaleDateString()}
        </Text>
      )}
      
      <Text style={styles.genderLabel}>Cinsiyet</Text>
      <Picker
        selectedValue={gender}
        style={styles.picker}
        onValueChange={(itemValue) => setGender(itemValue)}
      >
        <Picker.Item label="Erkek" value="male" />
        <Picker.Item label="Kadın" value="female" />
        <Picker.Item label="Diğer" value="other" />
      </Picker>

      <TouchableOpacity style={styles.registerButton} onPress={registerUser}>
        <Text style={styles.registerButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
  input: {
    height: 50,
    flex: 1,
    fontSize: 16,
    paddingLeft: 10,
  },
  phoneInputContainer: {
    flex: 1,
    height: 50,
  },
  textContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    height: 50,
  },
  datePickerButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  datePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dateDisplay: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    color: '#555',
  },
  genderLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 15,
  },
  registerButton: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
