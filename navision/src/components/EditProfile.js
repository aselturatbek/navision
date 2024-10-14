import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image, ScrollView, ActivityIndicator } from 'react-native';
import { auth } from '../firebase';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getDatabase, ref, set } from 'firebase/database';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

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
  const [loading, setLoading] = useState(false); // Loading state
  const firestore = getFirestore();
  const database = getDatabase();
  const storage = getStorage();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = auth.currentUser.uid;
      const docRef = doc(firestore, 'userInfo', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.log('Kullanıcı bilgileri bulunamadı.');
      }
    };

    fetchUserInfo();
  }, [firestore]);

  const updateProfile = async () => {
    setLoading(true); // Start loading
    const userId = auth.currentUser.uid;
    const user = auth.currentUser;

    try {
      if (userInfo.email !== user.email) {
        await user.updateEmail(userInfo.email);
        await user.sendEmailVerification();
        Alert.alert("Başarılı", "E-posta adresi güncellendi ve doğrulama e-postası gönderildi. Lütfen e-posta adresinizi kontrol edin.");
      }

      await setDoc(doc(firestore, 'userInfo', userId), userInfo);
      await set(ref(database, 'userInfo/' + userId), userInfo);

      Alert.alert("Başarılı", "Profil başarıyla güncellendi.", [
        { text: "Tamam", onPress: () => {
            onUpdate(userInfo);
            navigation.navigate('Profile');
          }
        }
      ]);
    } catch (error) {
      Alert.alert("Hata", error.message);
    } finally {
      setLoading(false); // End loading
    }
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
      quality: 0.5,
    });

    if (!result.canceled) {
      const source = result.assets[0].uri;

      // Firebase Storage'a resmi yüklemeden önce eski resmi sil
      if (userInfo.profileImage) {
        const oldImageRef = storageRef(storage, userInfo.profileImage);
        try {
          await deleteObject(oldImageRef);
        } catch (error) {
          console.log('Eski resmi silerken hata oluştu:', error);
        }
      }

      const uniqueFileName = `profileImages/${auth.currentUser.uid}_${Date.now()}.jpg`;
      const response = await fetch(source);
      const blob = await response.blob();
      const imageRef = storageRef(storage, uniqueFileName);
      
      setLoading(true); // Start loading for image upload
      try {
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
        const updatedUserInfo = { ...userInfo, profileImage: downloadURL };
        setUserInfo(updatedUserInfo);
        onUpdate(updatedUserInfo);
      } catch (error) {
        Alert.alert("Hata", "Resim yüklenirken bir hata oluştu: " + error.message);
      } finally {
        setLoading(false); // End loading
      }
    } else {
      console.log('Kullanıcı resmi seçmeyi iptal etti.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Profilinizi Düzenleyin</Text>
      
      {loading ? ( // Show loading indicator
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
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
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
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
    backgroundColor: '#ffffff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 10,
    alignSelf: 'center',
  },
});

export default EditProfile;
