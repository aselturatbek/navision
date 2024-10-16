import React, { useState } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc , getDocs, collection} from 'firebase/firestore'; 
import { getDatabase, ref, set } from 'firebase/database'; 
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const RegisterScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigation = useNavigation(); 
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const firestore = getFirestore(); 
  const database = getDatabase(); 

  const checkUsernameExists = async (username) => {
    const snapshot = await getDocs(collection(firestore, 'userInfo'));
    return snapshot.docs.some(doc => doc.data().username === username);
  };

  const isEmailValid = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const isPasswordValid = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~`|\\])[A-Za-z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~`|\\]{8,}$/;
    return re.test(password);
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else registerUser(); 
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
          dateOfBirth: dateOfBirth,
          gender: gender,
          biography:'',
          profileImage:''
        });

        // Realtime Database'de kullanıcı bilgilerini kaydet
        await set(ref(database, `users/${userId}`), {
          username: username,
          phoneNumber: phoneNumber,
          email: email,
          name: name,
          surname: surname,
          dateOfBirth: dateOfBirth,
          gender: gender,
          biography:'',
          profileImage:''
        });

        // Başarılı mesajı göster ve sonra 3. adımı göster
        Alert.alert("Başarılı", "Kayıt başarılı! E-posta doğrulama linki gönderildi.");
        setCurrentStep(3);

        // 2 saniye sonra kullanıcıyı login ekranına yönlendir
        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000); // 2 saniye bekleme süresi
      } else {
        Alert.alert("Hata", "Şifreler uyuşmuyor.");
      }
    } catch (error) {
      Alert.alert("Hata", error.message);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={[
            styles.circle,
            { 
              backgroundColor: currentStep >= step ? '#007BFF' : '#ddd',
              width: currentStep === step ? null : 35,
              height: currentStep === step ? null : 30,
              paddingHorizontal: currentStep === step ? 10 : 0,
              justifyContent: currentStep === step ? 'center' : 'center',
            }
          ]}
        >
          {currentStep > step || (currentStep === 3 && step === 3) ? (
            <Icon name="checkmark" size={20} color="#fff" />
          ) : currentStep === step ? (
            <Text style={styles.stepTextActive}>
              {step === 1 ? 'Kişisel Bilgiler' : step === 2 ? 'Güvenlik Bilgileri' : ''}
            </Text>
          ) : (
            <Text style={styles.stepText}>{step}</Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text style={styles.title}>
              navision’a {"\n"}
              <Text style={styles.title2}>
               Kayıt Ol.
              </Text>
            </Text>
            {renderStepIndicator()}
            <Text style={styles.labelText}>Ad & Soyad</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
            />
            <Text style={styles.labelText}>Telefon Numarası</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          <View style={styles.rowContainer}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.labelText}>Doğum Günü</Text>
              <TextInput
                style={styles.input}
                placeholder="gg.aa.yyyy"
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.labelTextGender}>Cinsiyet</Text>
              <TextInput
                style={styles.input}
                placeholder="Erkek, Kadın, Diğer"
                value={gender}
                onChangeText={setGender}
              />
            </View>
          </View>

            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Devam et</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.alreadyHaveAccount}>Hesabın zaten var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.title}>
              Çok az {"\n"}
              <Text style={styles.title2}>
               Kaldı.
              </Text>
            </Text>
            {renderStepIndicator()}
            <Text style={styles.labelText}>Kullanıcı Adı</Text>
            <TextInput
              style={styles.input}
              placeholder="username"
              value={username}
              onChangeText={setUsername}
            />
            <Text style={styles.labelText}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={styles.labelText}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.labelText}>Şifre Onayla</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifreni Onayla"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={registerUser}>
              <Text style={styles.buttonText}>Kayıt Ol</Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.alreadyHaveAccount}>Hesabın zaten var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginText}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      case 3:
        return (
          <View style={styles.center}>
            <Text style={styles.title}>
              navision’a {"\n"}
              <Text style={styles.title2}>
               Hoşgeldin.
              </Text>
            </Text>
          </View>
        );
      default:
        return null;
    }
  };
  
  return <ScrollView contentContainerStyle={styles.container}>{renderContent()}</ScrollView>;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize:32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop:50,
    fontFamily:'ms-bold'
  },
  title2: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily:'ms-light'
  },
  labelText:{
    fontFamily:'ms-bold',
    marginBottom:8
  },
  labelTextGender:{
    fontFamily:'ms-bold',
    marginBottom:8,
    marginLeft:1,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily:'ms-regular'
  },
  phoneInputContainer: {
    height: 40,  
    borderColor: '#ddd',
    borderWidth: 1,  
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 15,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 5,
    height:50
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily:'ms-bold'
  },
  stepText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily:'ms-bold'
  },
  stepTextActive: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontFamily:'ms-regular'
  },
  circle: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  alreadyHaveAccount: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'ms-regular',
  },
  loginText: {
    fontSize: 14,
    color: '#007BFF',
    fontFamily: 'ms-bold',
  },
});

export default RegisterScreen;
