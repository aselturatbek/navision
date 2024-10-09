import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase'; 
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase';
import { auth } from '../firebase';
import * as Location from 'expo-location';

const StoryShareModal = ({ visible, onClose }) => {
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [userInfo, setUserInfo] = useState({ username: '', surname: '', profileImage: '' });
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true); // Loading durumu

  const fetchUserInfo = async (currentUserId) => {
    const userDoc = await getDoc(doc(db, 'userInfo', currentUserId));
    if (userDoc.exists()) {
      setUserInfo(userDoc.data());
    } else {
      console.log('No such user!');
    }
  };

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      setLoading(true); // Loading'i başlat
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const [place] = await Location.reverseGeocodeAsync(location.coords);
        if (place) {
          setCity(place.city || place.name);
          setCountry(place.country);
        }
      } else {
        Alert.alert('Konum izni gerekli', 'Uygulamanın konumunu kullanabilmesi için izin vermeniz gerekiyor.');
      }
      setLoading(false); // Loading'i durdur
    };

    if (currentUserId) {
      fetchUserInfo(currentUserId);
      fetchCurrentLocation();
    }
  }, [currentUserId]);

  useEffect(() => {
    if (visible) {
      setDescription('');
      setMediaUri(null);
      setLocation(null);
      setCity('');
      setCountry('');
      setUserInfo({ username: '', surname: '', profileImage: '' });
      setLoading(true); // Modal açıldığında loading'i başlat
    }
  }, [visible]);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const handleShare = async () => {
    try {
      let mediaUrl = null;
      if (mediaUri) {
        const mediaRef = ref(storage, `stories/${currentUserId}/${Date.now()}.jpg`);
        const img = await fetch(mediaUri);
        const bytes = await img.blob();
        await uploadBytes(mediaRef, bytes);
        mediaUrl = await getDownloadURL(mediaRef);
      }

      const storyData = {
        userId: currentUserId,
        username: userInfo.username || '',
        surname: userInfo.surname || '',
        profileImage: userInfo.profileImage || '',
        description: description || '',
        mediaUrl,
        location: location || {
          latitude: null,
          longitude: null,
        },
        city: city || '',
        country: country || '',
        timestamp: new Date(),
      };

      console.log('Story Data:', storyData);

      if (!storyData.userId) {
        throw new Error('userId is undefined.');
      }

      await addDoc(collection(db, 'stories'), storyData);

      Alert.alert(
        'Başarılı!',
        'Story başarıyla kaydedildi.',
        [{ text: 'Tamam', onPress: onClose }]
      );
    } catch (error) {
      console.error('Error sharing story:', error);
      Alert.alert('Hata', 'Story paylaşımında bir sorun oluştu. Lütfen tekrar deneyin.');
    } finally {
      // Modal kapandığında state'i sıfırlayın
      setDescription('');
      setMediaUri(null);
      setLocation(location);
      setCity('');
      setCountry('');
      setUserInfo({ username: '', surname: '', profileImage: '' });
    }
  };

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    Location.reverseGeocodeAsync({ latitude, longitude }).then((places) => {
      const place = places[0];
      if (place) {
        setCity(place.city || place.name);
        setCountry(place.country);
      }
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Story</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <View style={styles.mediaPreview}>
            {mediaUri ? (
              <Image source={{ uri: mediaUri }} style={styles.media} resizeMode="cover" />
            ) : (
              <Text>No media selected</Text>
            )}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Add a description..."
            value={description}
            onChangeText={setDescription}
          />

          {loading ? ( // Loading durumu kontrolü
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <MapView
              style={styles.map}
              onPress={handleMapPress}
              region={{
                latitude: location ? location.latitude : 37.78825,
                longitude: location ? location.longitude : -122.4324,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            >
              {location && (
                <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
              )}
            </MapView>
          )}

          <View style={styles.iconRow}>
            <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
              <Ionicons name="image" size={24} color="black" />
              <Text style={styles.iconText}>Media</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
            <Text style={styles.shareButtonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'space-around',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mediaPreview: {
    height: 200,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  iconButton: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StoryShareModal;
