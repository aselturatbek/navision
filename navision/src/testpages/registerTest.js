import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) setDateOfBirth(selectedDate);
  };

  const handleNextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
    else Alert.alert('Hoş Geldin!', 'Kayıt başarıyla tamamlandı.');
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3].map((step) => (
        <View
          key={step}
          style={[
            styles.circle,
            { backgroundColor: currentStep >= step ? '#007BFF' : '#ddd' },
          ]}
        />
      ))}
    </View>
  );

  const renderContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <View>
            <Text style={styles.title}>navision’a Kayıt Ol.</Text>
            {renderStepIndicator()}
            <TextInput
              style={styles.input}
              placeholder="Ad & Soyad"
              value={name}
              onChangeText={setName}
            />
            <PhoneInput
              defaultCode="TR"
              layout="first"
              onChangeFormattedText={setPhoneNumber}
              containerStyle={styles.phoneInputContainer}
              textContainerStyle={styles.textContainer}
            />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.datePickerText}>Doğum Günü</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                onChange={onChangeDate}
              />
            )}
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Cinsiyet" value="" />
              <Picker.Item label="Erkek" value="male" />
              <Picker.Item label="Kadın" value="female" />
              <Picker.Item label="Diğer" value="other" />
            </Picker>
            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Devam et</Text>
            </TouchableOpacity>
          </View>
        );
      case 2:
        return (
          <View>
            <Text style={styles.title}>Çok az kaldı.</Text>
            {renderStepIndicator()}
            <TextInput
              style={styles.input}
              placeholder="Email"
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
              placeholder="Şifreni Onayla"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.button} onPress={handleNextStep}>
              <Text style={styles.buttonText}>Devam et</Text>
            </TouchableOpacity>
          </View>
        );
      case 3:
        return (
          <View style={styles.center}>
            <Text style={styles.title}>navision’a Hoş Geldin.</Text>
            {renderStepIndicator()}
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  phoneInputContainer: {
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  textContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  datePickerText: {
    color: '#007BFF',
    textAlign: 'center',
    marginBottom: 15,
    fontSize: 16,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RegisterScreen;
