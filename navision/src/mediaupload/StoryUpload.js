import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, getDoc, doc, getDocs, writeBatch } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../firebase';
import * as Location from 'expo-location';

const StoryUpload = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [userInfo, setUserInfo] = useState({ username: '', name: '', surname: '', profileImage: '' });
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
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
      setLoading(false);
    };

    if (currentUserId) {
      fetchUserInfo(currentUserId);
      fetchCurrentLocation();
    }
  }, [currentUserId]);

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
      quality: 0.5,
    });

    if (!result.canceled) {
      setMediaUri(result.assets[0].uri);
    }
  };

  const updateStoriesWithNewProfileImage = async (newProfileImage) => {
    try {
      const storiesRef = collection(db, 'stories');
      const storiesSnapshot = await getDocs(storiesRef);

      const batch = writeBatch(db); // Firestore batched write işlemi

      storiesSnapshot.forEach((doc) => {
        const storyData = doc.data();
        if (storyData.userId === currentUserId) {
          // Eğer hikaye bu kullanıcıya aitse, profil resmini güncelle
          batch.update(doc.ref, { profileImage: newProfileImage });
        }
      });

      await batch.commit(); // Tüm güncellemeleri tek seferde uygula
      console.log('Hikayeler güncellendi.');
    } catch (error) {
      console.error('Hikaye güncellemeleri sırasında hata oluştu: ', error);
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
        name: userInfo.name || '',
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

      // Story ekle
      await addDoc(collection(db, 'stories'), storyData);

      // Profil resmi güncellendiyse hikayeleri güncelle
      if (userInfo.profileImage) {
        await updateStoriesWithNewProfileImage(userInfo.profileImage);
      }

      Alert.alert(
        'Başarılı!',
        'Story başarıyla kaydedildi.',
        [{ text: 'Tamam', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error sharing story:', error);
      Alert.alert('Hata', 'Story paylaşımında bir sorun oluştu. Lütfen tekrar deneyin.');
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
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Story Paylaş</Text>
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
        placeholder="Açıklama ekle..."
        value={description}
        onChangeText={setDescription}
      />

      <MapView
        style={styles.map}
        onPress={handleMapPress}
        region={location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : {
          latitude: 37.78825, 
          longitude: -122.4324,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {location && (
          <Marker coordinate={{ latitude: location.latitude, longitude: location.longitude }} />
        )}
      </MapView>

      <View style={styles.iconRow}>
        <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
          <Ionicons name="image" size={24} color="black" />
          <Text style={styles.iconText}>Medya</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Paylaş</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  header: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mediaPreview: {
    height: 200,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  map: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
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
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default StoryUpload;
