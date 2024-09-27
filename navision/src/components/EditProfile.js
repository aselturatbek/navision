import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // İkonlar için Expo'dan MaterialIcons kullanıyoruz

const EditProfile = ({ username, email, phoneNumber, bio, location }) => {
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Koala_climbing_tree.jpg/640px-Koala_climbing_tree.jpg' }} 
          style={styles.profileImage} 
        />
        <TouchableOpacity style={styles.changePhotoButton}>
          <MaterialIcons name="edit" size={24} color="#1995AD" />
          <Text style={styles.changePhotoText}>Fotoğrafı Değiştir</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.username}>{username}</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Email: {email}</Text>
        <Text style={styles.infoText}>Phone: {phoneNumber}</Text>
        <Text style={styles.infoText}>Bio: {bio}</Text>
        <Text style={styles.infoText}>Location: {location}</Text>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Profili Düzenle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Profili Sil</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#F1F1F2',
    padding: 20,
    marginTop:70
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#1995AD',
    marginRight: 10,
  },
  changePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changePhotoText: {
    fontSize: 16,
    color: '#1995AD',
    marginLeft: 5,
    fontFamily: 'ms-regular',
  },
  username: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1995AD',
    marginBottom: 10,
    fontFamily: 'ms-regular',
  },
  infoContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontFamily: 'ms-regular',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#1995AD',
    paddingVertical: 12,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'ms-regular',
  },
});

export default EditProfile;
