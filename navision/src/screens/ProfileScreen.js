import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { auth } from '../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const firestore = getFirestore();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = auth.currentUser.uid; // Giriş yapan kullanıcının ID'si
      const docRef = doc(firestore, 'userInfo', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfo(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };

    fetchUserInfo();
  }, []);

  if (!userInfo) {
    return <Text>Loading...</Text>; // Veriler yüklenirken gösterilecek
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile')}>
        <Icon name="create-outline" size={24} color="#fff" />
      </TouchableOpacity>

      <Image source={{ uri: userInfo.profileImage || 'https://via.placeholder.com/150' }} style={styles.profileImage} />

      <Text style={styles.title}>{userInfo.name} {userInfo.surname}</Text>
      <Text style={styles.info}>Kullanıcı Adı: {userInfo.username}</Text>
      <Text style={styles.info}>E-posta: {userInfo.email}</Text>
      <Text style={styles.info}>Telefon: {userInfo.phoneNumber}</Text>
      <Text style={styles.info}>Doğum Tarihi: {userInfo.dateOfBirth}</Text>
      <Text style={styles.info}>Cinsiyet: {userInfo.gender}</Text>
      <Text style={styles.info}>Biyografi: {userInfo.bio}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    padding: 10,
  },
});

export default ProfileScreen;
