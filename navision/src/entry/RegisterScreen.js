import React, { useState, useRef } from 'react';
import { View, TextInput, Alert, StyleSheet, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../firebase'; 
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getFirestore, doc, setDoc , getDocs, collection} from 'firebase/firestore'; 
import { getDatabase, ref, set } from 'firebase/database'; 
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import PhoneInput from 'react-native-phone-number-input';
import { TextInputMask } from 'react-native-masked-text';

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
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedGender, setSelectedGender] = useState({ erkek: false, kadın: false, diğer: false }); // Checkbox durumları

  const handleGenderChange = (type) => {
    const newSelectedGender = { erkek: false, kadın: false, diğer: false };
    newSelectedGender[type] = !selectedGender[type];
    setSelectedGender(newSelectedGender);
    setGender(type); // Seçilen cinsiyet state'ini güncelle
    setDropdownVisible(false);
  };
  const checkUsernameExists = async (username) => {
    const snapshot = await getDocs(collection(firestore, 'userInfo'));
    return snapshot.docs.some(doc => doc.data().username === username);
  }

  const handleDropdownToggle = () => {
    setDropdownVisible(!dropdownVisible); // Dropdown'u aç/kapa
  };

  const renderGenderOptions = () => (
    <View style={styles.dropdownOptions}>
      <TouchableOpacity style={styles.option} onPress={() => handleGenderChange('erkek')}>
        <View style={styles.checkboxContainer}>
          {selectedGender.erkek && <Icon name="checkmark" size={20} color="#007BFF" />}
        </View>
        <Text style={styles.optionText}>erkek</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleGenderChange('kadın')}>
        <View style={styles.checkboxContainer}>
          {selectedGender.kadın && <Icon name="checkmark" size={20} color="#007BFF" />}
        </View>
        <Text style={styles.optionText}>kadın</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleGenderChange('diğer')}>
        <View style={styles.checkboxContainer}>
          {selectedGender.diğer && <Icon name="checkmark" size={14} color="#007BFF" />}
        </View>
        <Text style={styles.optionText}>diğer</Text>
      </TouchableOpacity>
    </View>
  );
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const isPasswordValid = (password) => {
    const re = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~|\\])[A-Za-z\d!@#$%^&*()\-_=+{}[\]:;"'<>,.?/~|\\]{8,}$/;
    return re.test(password);
  };
  


  const phoneInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const confirmPasswordInputRef = useRef(null);
  
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

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else registerUser(); 
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step, index) => (
        <React.Fragment key={step}>
          <View
            style={[styles.circle, { 
              backgroundColor: currentStep >= step ? '#007BFF' : '#ddd',
              borderColor: currentStep >= step ? '#007BFF' : '#007BFF',
              borderWidth: currentStep >= step ? 1 : 1,
              width: currentStep === step ? null: 35,
              height: currentStep === step ? 30 : 30,
              paddingHorizontal: currentStep === step ? 10 : 0,
              justifyContent: currentStep === step ? 'center' : 'center',
            }]}
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
          {index < 2 && <View style={styles.stepLine} />}
        </React.Fragment>
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
              returnKeyType="next"
              blurOnSubmit={true}
            />
            <Text style={styles.labelText}>Telefon Numarası</Text>
            <PhoneInput
              codeTextStyle={{ fontFamily: 'ms-regular', color: 'black',fontSize:14 }} 
              textInputProps={{ style: { fontFamily: 'ms-regular'} }} 
              containerStyle={styles.phoneInputContainer}  
              textContainerStyle={styles.phoneInputTextContainer}  
              ref={phoneInputRef}
              defaultValue={phoneNumber}
              defaultCode="TR" // Türkiye kodu +90
              layout="second"
              returnKeyType="done"
              onChangeText={setPhoneNumber}
              countryPickerProps={{ withAlphaFilter: true }}
            />
            <View style={styles.rowContainer}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.labelText}>Doğum Günü</Text>
                <TextInputMask
                  type={'datetime'}
                  options={{
                    format: 'DD/MM/YYYY',
                  }}
                  style={styles.input}
                  placeholder="gg/aa/yyyy"
                  value={dateOfBirth}
                  onChangeText={setDateOfBirth}
                  returnKeyType="next"
                  blurOnSubmit={false}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.labelTextGender}>Cinsiyet</Text>
                <TouchableOpacity style={styles.input} onPress={handleDropdownToggle}>
                <Text style={styles.dropdownText}>{gender ? gender : 'Cinsiyet Seçiniz'}</Text>
                <Icon style= {styles.dropdownIcon} name={dropdownVisible ? 'chevron-up' : 'chevron-down'} size={20} color="#007BFF" />
              </TouchableOpacity>

              {dropdownVisible && renderGenderOptions()}
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
              returnKeyType="next"
              onSubmitEditing={() => emailInputRef.current.focus()}
              blurOnSubmit={false}
            />
            <Text style={styles.labelText}>E-mail</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              ref={emailInputRef}
              returnKeyType="next"
              keyboardType="email-address"  // E-posta için klavye tipi
              onSubmitEditing={() => passwordInputRef.current.focus()}
              blurOnSubmit={false}
            />
            <Text style={styles.labelText}>Şifre</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              returnKeyType="done"
              
              blurOnSubmit={false}
            />
            <Text style={styles.labelText}>Şifre Onayla</Text>
            <TextInput
              style={styles.input}
              placeholder="Şifreni Onayla"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              returnKeyType="done"
              onSubmitEditing={registerUser}
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
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0:50}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {renderContent()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 50,
    fontFamily: 'ms-bold',
  },
  title2: {
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'ms-light',
  },
  labelText: {
    fontFamily: 'ms-bold',
    marginBottom: 8,
  },
  labelTextGender: {
    fontFamily: 'ms-bold',
    marginBottom: 8,
    marginLeft: 1,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontFamily: 'ms-regular',
  },
  phoneInputContainer: {
    borderColor: '#ddd',
    backgroundColor:'transparent',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    height: 44,
    width:330,
  },
  phoneInputTextContainer: {
    borderRadius: 8,
    backgroundColor: 'transparent',
    fontSize:22,
    height: 70,
    marginTop:-14,
    fontFamily:'ms-regular'
  },
  dropdown: {
    borderColor: '#ddd',
    backgroundColor:'#fff',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    zIndex:1000
  },
  dropdownIcon:{
    alignSelf:'flex-end',
    position:'absolute',
    bottom:7,
    right:5

  },
  dropdownText: {
    fontSize: 14,
    color: '#000',
    fontFamily:'ms-regular',
    alignSelf:'flex-start',
    marginTop:10
  },
  dropdownOptions: {
    position: 'absolute',
    top: 70, // Dropdown'un konumunu ayarla
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    zIndex:1000,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    zIndex:1000
  },
  checkboxContainer: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#007BFF',
    borderRadius:5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  optionText: {
    fontSize: 14,
    fontFamily:'ms-regular'
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
    height: 50,
    zIndex:-1
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ms-bold',
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  circle: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },
  stepLine: {
    width: 60,
    height: 1,
    backgroundColor: '#007BFF',
    borderRadius: 2,
  },
  stepText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'ms-bold',
  },
  stepTextActive: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'ms-regular',
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
    zIndex:-1
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
