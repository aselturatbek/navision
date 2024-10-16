import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { auth } from '../firebase';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const firestore = getFirestore();

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

  useEffect(() => {
    fetchUserInfo(); // Bileşen ilk yüklendiğinde kullanıcı bilgilerini çek
  }, []);

  const handleUpdate = (updatedInfo) => {
    setUserInfo(updatedInfo); // Kullanıcı bilgisini güncelle
  };

  const renderGridItem = () => (
    <View style={styles.gridItem} />
  );

  if (!userInfo) {
    return <Text>Loading...</Text>; // Veriler yüklenirken gösterilecek
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: userInfo.profileImage || 'https://via.placeholder.com/150' }}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditProfile', { onUpdate: handleUpdate })}>
            <Icon name="create-outline" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.username}>{userInfo.name} {userInfo.surname}</Text>
          <Text style={styles.handle}>@{userInfo.username}</Text>
          <Text style={styles.biography}>{userInfo.biography}</Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>213</Text>
            <Text style={styles.statLabel}>Paylaşım</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>241</Text>
            <Text style={styles.statLabel}>Takipçi</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statCount}>123</Text>
            <Text style={styles.statLabel}>Takip Edilen</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.followButton}>
            <Text style={styles.buttonText}>Takip Et</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.messageButton}>
            <Text style={styles.buttonText}>Mesaj At</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="ellipsis-horizontal" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Grid Layout for posts */}
      <FlatList
        data={[1, 2, 3, 4, 5, 6]} // Test verileri
        renderItem={renderGridItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.grid}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    alignItems: 'flex-start',
    flexDirection:'row',
    height:250
  },
  userInfo: {
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  editButton: {
    position: 'absolute',
    top: 55,
    right: 40,
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderRadius: 20,
  },
  username: {
    fontSize: 20,
    fontFamily:'ms-bold',
    marginTop: 10,
  },
  handle: {
    fontSize: 14,
    fontFamily:'ms-regular',
    color: '#555',
  },
  biography: {
    fontSize: 14,
    fontFamily:'ms-light',
    color: '#555',
    textAlign: 'center',
    marginTop: 5,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom:50,
    paddingRight:20
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    
  },
  statCount: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily:'ms-regular'
  },
  statLabel: {
    fontSize: 12,
    color: '#555',
    fontFamily:'ms-light'
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position:'absolute',
    marginTop: 190,
    marginLeft:11,
    alignItems:'center'
    

  },
  followButton: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    width:150
  },
  messageButton: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    width:150
  },
  moreButton: {
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
    
  },
  buttonText:{
    textAlign:'center',
    fontFamily:'ms-bold',
    color:'grey',


  },
  grid: {
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  gridItem: {
    backgroundColor: '#e0e0e0',
    width: '48%',
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default ProfileScreen;
