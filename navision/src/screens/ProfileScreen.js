import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../firebase';  // Firestore bağlantısı
import { doc, getDoc } from 'firebase/firestore';  // Firestore'dan veriyi almak için


const ProfileScreen = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null);  // Kullanıcı bilgilerini tutmak için
  const [bio, setBio] = useState("Kendin hakkında bir şeyler yaz...");
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);  // Yükleme durumunu izlemek için

  // Kullanıcı bilgilerini Firestore'dan çekmek için fonksiyon
  const fetchUserInfo = async () => {
    try {
      const uid = auth.currentUser?.uid;  // Oturum açmış kullanıcının UID'si
      if (uid) {
        const docRef = doc(db, 'userInfo', uid);  // Kullanıcı UID'sine göre belge
        const docSnap = await getDoc(docRef);  // Belgeyi çek
        if (docSnap.exists()) {
          const data = docSnap.data();  // Belgede veri varsa al
          setUserInfo(data);
          setBio(data.bio || "Kendin hakkında bir şeyler yaz...");
          setProfileImage(data.profileImage || null);
        } else {
          console.log("No such document!");  // Belge bulunmazsa
        }
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);  // Hata olursa
    } finally {
      setLoading(false);  // Yükleme durumu bitti
    }
  };

  useEffect(() => {
    fetchUserInfo();  // Komponent yüklendiğinde kullanıcı bilgilerini çek
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;  // Yükleniyor göstergesi
  }

  return (
    <View style={styles.container}>
      {/* Profil Fotoğrafı */}
      <Image
        source={profileImage ? { uri: profileImage } : require('../assets/images/default_cat.jpg')}
        style={styles.profileImage}
      />
      {/* Kullanıcı Bilgileri */}
      {userInfo ? (
        <View style={styles.userInfoContainer}>
          <Text style={styles.username}>{userInfo.username}</Text>
          <Text style={styles.userInfoText}>Ad: {userInfo.name}</Text>
          <Text style={styles.userInfoText}>Soyad: {userInfo.surname}</Text>
          <Text style={styles.userInfoText}>Doğum Tarihi: {userInfo.dateOfBirth}</Text>
          <Text style={styles.userInfoText}>Cinsiyet: {userInfo.gender}</Text>
          <Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
          <Text style={styles.userInfoText}>Telefon: {userInfo.phoneNumber}</Text>
          <Text style={styles.bioText}>Biyografi: {bio}</Text>
        </View>
      ) : (
        <Text style={styles.errorText}>Kullanıcı bilgileri bulunamadı.</Text>
      )}
      {/* Düzenle Butonu */}
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
        <Text style={styles.editButtonText}>Profili Düzenle</Text>
      </TouchableOpacity>
    </View>
  );
};

// Stil tanımlamaları
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    marginBottom: 20,
  },
  userInfoContainer: {
    width: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 4,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
  editButton: {
    backgroundColor: '#0095F6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
