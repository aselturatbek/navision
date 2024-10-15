import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const PostUpload = ({ navigation }) => {
  const [mediaUrls, setMediaUrls] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null); // Manuel veya anlık konum
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [region, setRegion] = useState(null); // Harita bölgesi

  const auth = getAuth();
  const firestore = getFirestore();
  const storage = getStorage();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userId = auth.currentUser.uid;
        const userDocRef = doc(firestore, 'userInfo', userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUserInfo(userDoc.data());
        } else {
          console.log('Kullanıcı bilgileri bulunamadı.');
        }
      } catch (error) {
        console.error('Veri alınırken hata oluştu:', error);
      }
    };

    fetchUserInfo();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('İzin Gerekli', 'Konum izni vermeniz gerekiyor.');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords); // Anlık konumu ayarla
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, [auth, firestore]);

  const resetForm = () => {
    setMediaUrls([]);
    setDescription('');
    setLocation(null);
    setCity('');
    setCountry('');
  };

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      const newMedia = result.assets.map((asset) => asset.uri);
      setMediaUrls([...mediaUrls, ...newMedia]);
    }
  };

  const uploadMedia = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const uniqueFileName = `posts/${auth.currentUser.uid}_${Date.now()}.jpg`;
    const mediaRef = storageRef(storage, uniqueFileName);
    await uploadBytes(mediaRef, blob);
    return getDownloadURL(mediaRef);
  };

  const reverseGeocode = async (latitude, longitude) => {
    const address = await Location.reverseGeocodeAsync({ latitude, longitude });
    if (address.length > 0) {
      setCity(address[0].city);
      setCountry(address[0].country);
    }
  };

  const handleLocationSelect = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const handleUploadPost = async () => {
    if (mediaUrls.length === 0 || !location) {
      Alert.alert('Hata', 'Lütfen medya ve konum seçin.');
      return;
    }

    try {
      const uploadedMediaUrls = await Promise.all(mediaUrls.map((uri) => uploadMedia(uri)));
      const currentUser = auth.currentUser;

      const postData = {
        userId: currentUser.uid,
        username: userInfo.username || 'Anonim',
        name: userInfo.name || 'Ad',
        surname: userInfo.surname || 'Soyad',
        profileImage: userInfo.profileImage || 'https://via.placeholder.com/150',
        mediaUrls: uploadedMediaUrls,
        description,
        location: { city, country },
        timestamp: serverTimestamp(),
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
      };

      console.log('Post Data:', postData);

      await addDoc(collection(firestore, 'posts'), postData);

      Alert.alert('Başarılı', 'Post yüklendi!');
      resetForm(); // Formu sıfırla

      navigation.navigate('Home', { location });
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Medya Seç" onPress={pickMedia} />
      <View style={styles.mediaContainer}>
        {mediaUrls.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.media} />
        ))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Açıklama ekleyin..."
        value={description}
        onChangeText={setDescription}
      />

      <MapView
        style={styles.map}
        region={region}
        onPress={handleLocationSelect}
      >
        {location && (
          <Marker
            coordinate={location}
            pinColor="red" // Kırmızı marker
            title={`${city}, ${country}`}
          />
        )}
      </MapView>

      <Button title="Postu Yükle" onPress={handleUploadPost} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  media: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 10,
  },
});

export default PostUpload;
