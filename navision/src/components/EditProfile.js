import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, Image, ScrollView, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { auth } from '../firebase';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, query, where, writeBatch } from 'firebase/firestore';
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

  // updatePosts fonksiyonunu burada tanımla
  const updatePosts = async (userId, username, profileImage) => {
    const postsRef = collection(firestore, 'posts');
    const querySnapshot = await getDocs(query(postsRef, where("userId", "==", userId)));

    const batch = writeBatch(firestore);
    
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        username: username,
        profileImage: profileImage
      });
    });

    await batch.commit();
  };
  //updateLoops
  const updateLoops = async (userId, username, profileImage) => {
    const postsRef = collection(firestore, 'loops');
    const querySnapshot = await getDocs(query(postsRef, where("userId", "==", userId)));

    const batch = writeBatch(firestore);
    
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        username: username,
        profileImage: profileImage
      });
    });

    await batch.commit();
  };

  // updatePosts fonksiyonunu burada tanımla
  const updateStories = async (userId, username, profileImage) => {
    const postsRef = collection(firestore, 'stories');
    const querySnapshot = await getDocs(query(postsRef, where("userId", "==", userId)));

    const batch = writeBatch(firestore);
    
    querySnapshot.forEach((doc) => {
      batch.update(doc.ref, {
        username: username,
        profileImage: profileImage
      });
    });

    await batch.commit();
  };

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
  

      await updatePosts(userId, userInfo.username, userInfo.profileImage);
      await updateStories(userId, userInfo.username, userInfo.profileImage);
      await updateLoops(userId, userInfo.username, userInfo.profileImage);

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
  
    if (!result.canceled) {
      const source = result.assets[0].uri;
      const uniqueFileName = `profileImages/${auth.currentUser.uid}_${Date.now()}.jpg`;
      
      // Resmi önce küçük bir versiyona dönüştürmeyi dene
      try {
        const response = await fetch(source);
        const blob = await response.blob();
  
        setLoading(true); // Yükleme başlıyor
        const imageRef = storageRef(storage, uniqueFileName);
  
        // Yeni resmi yükle
        await uploadBytes(imageRef, blob);
        const downloadURL = await getDownloadURL(imageRef);
  
        // Güncellenen resmi state'e ekle
        setUserInfo({ ...userInfo, profileImage: downloadURL });
  
        // Eski resmi sil
        if (userInfo.profileImage) {
          const oldImageRef = storageRef(storage, userInfo.profileImage);
          await deleteObject(oldImageRef).catch(error => {
            console.warn('Eski resmi silerken hata oluştu:', error.message);
          });
        }
        
      } catch (error) {
        console.error('Resim yüklenirken hata oluştu:', error.message);
        Alert.alert("Hata", "Resim yüklenirken bir hata oluştu. Lütfen tekrar deneyin.");
      } finally {
        setLoading(false); // Yükleme bitiyor
      }
    } else {
      console.log('Kullanıcı resmi seçmeyi iptal etti.');
    }
  };
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" :0} // iOS'ta padding, Android'de varsayılan
      keyboardVerticalOffset={30} // Klavyeyi kaldırmak için yeterli bir offset ayarlayın
    >
      <ScrollView>
        <Text style={styles.header}>Profilinizi Düzenleyin</Text>
        
        {loading ? ( // Show loading indicator
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            <TouchableOpacity onPress={selectProfileImage}>
              <Image
                source={{ uri: userInfo.profileImage || 'https://via.placeholder.com/150' }}
                style={styles.profileImage}
              />
              <Text style={styles.editImageText}>Profil Resmini Düzenle</Text>
            </TouchableOpacity>

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

            <TouchableOpacity style={styles.saveButton} onPress={updateProfile}>
              <Text style={styles.saveButtonText}>Profili Güncelle</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',
    marginTop: 30,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 2,
  },
  editImageText: {
    textAlign: 'center',
    color: '#007bff',
    fontSize: 14,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: -10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfile;
