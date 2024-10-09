import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { auth } from '../firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

const EditProfile = ({ route }) => {
  const navigation = useNavigation();
  const { onUpdate } = route.params;
  const [userInfo, setUserInfo] = useState({
    username: '',
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
    birthOfDate: '',
    gender: '',
    biography: '',
    profileImage: '',
  });

  const firestore = getFirestore();
  const database = getDatabase();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = auth.currentUser.uid;

      const docRef = doc(firestore, 'userInfo', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      }
    };

    fetchUserInfo();
  }, [firestore, auth]);

  const updateProfile = async () => {
    const userId = auth.currentUser.uid;
    const user = auth.currentUser;

    if (userInfo.email !== user.email) {
      try {
        await user.updateEmail(userInfo.email);
        await user.sendEmailVerification();
        Alert.alert("Başarılı", "E-posta adresi güncellendi ve doğrulama e-postası gönderildi. Lütfen e-posta adresinizi kontrol edin.");
      } catch (error) {
        Alert.alert("Hata", error.message);
        return;
      }
    }

    await setDoc(doc(firestore, 'userInfo', userId), userInfo);
    await set(ref(database, 'userInfo/' + userId), userInfo);

    Alert.alert("Başarılı", "Profil başarıyla güncellendi.", [
      { text: "Tamam", onPress: () => {
        onUpdate(userInfo);
        navigation.navigate('Profile');
      }}
    ]);
  };

  const selectProfileImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('İzin verilmedi', 'Resim seçmek için izin gerekli.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const source = result.assets[0].uri;
      const updatedUserInfo = { ...userInfo, profileImage: source };
      setUserInfo(updatedUserInfo);
      onUpdate(updatedUserInfo);
    } else {
      console.log('Kullanıcı resmi seçmeyi iptal etti.');
    }
  };

  if (!userInfo) {
    return <Text>Loading...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profilinizi Düzenleyin</Text>
      
      <TextInput
        placeholder="Kullanıcı Adı"
        value={userInfo.username}
        onChangeText={(text) => setUserInfo({ ...userInfo, username: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Ad"
        value={userInfo.name}
        onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Soyad"
        value={userInfo.surname}
        onChangeText={(text) => setUserInfo({ ...userInfo, surname: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="E-posta"
        value={userInfo.email}
        onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Telefon Numarası"
        value={userInfo.phoneNumber}
        onChangeText={(text) => setUserInfo({ ...userInfo, phoneNumber: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Doğum Tarihi (YYYY-MM-DD)"
        value={userInfo.birthOfDate}
        onChangeText={(text) => setUserInfo({ ...userInfo, birthOfDate: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Cinsiyet"
        value={userInfo.gender}
        onChangeText={(text) => setUserInfo({ ...userInfo, gender: text })}
        style={styles.input}
      />
      <TextInput
        placeholder="Biyografi"
        value={userInfo.biography}
        onChangeText={(text) => setUserInfo({ ...userInfo, biography: text })}
        style={styles.input}
      />
      
      <Button title="Profil Resmi Seç" onPress={selectProfileImage} />
      {userInfo.profileImage ? (
        <Image source={{ uri: userInfo.profileImage }} style={styles.profileImage} />
      ) : (
        <Text>Profil resmi seçilmedi.</Text>
      )}
      
      <Button title="Profil Güncelle" onPress={updateProfile} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa', // Daha açık bir arka plan rengi
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff', // Giriş kutuları için beyaz arka plan
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    alignSelf: 'center', // Resmi merkezde göster
  },
});

export default EditProfile;
