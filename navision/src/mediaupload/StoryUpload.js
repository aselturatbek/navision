import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { auth, db, storage } from '../firebase';
import * as Location from 'expo-location';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const StoryUpload = ({ navigation }) => {
  const [description, setDescription] = useState('');
  const [mediaUri, setMediaUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const currentUserId = auth.currentUser?.uid;

  // Kullanıcı bilgilerini Firestore'dan çekme
  const fetchUserInfo = async () => {
    const docRef = doc(db, 'userInfo', currentUserId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setUserInfo(docSnap.data());
    } else {
      console.log('Kullanıcı bilgisi bulunamadı!');
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Kullanıcı bilgilerini bileşen yüklendiğinde çek
  }, []);

  useEffect(() => {
    const fetchCurrentLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const { coords } = await Location.getCurrentPositionAsync({});
        // Konum bilgilerini al
        const reverseGeocode = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        const address = reverseGeocode[0];

        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
          city: address.city || 'Bilinmiyor',
          country: address.country || 'Bilinmiyor',
        });
      } else {
        Alert.alert('Konum izni gerekli', 'Konum iznine izin vermeniz gerekiyor.');
      }
    };

    fetchCurrentLocation();
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!result.canceled) {
        setMediaUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Medya seçme hatası:', error);
      Alert.alert('Hata', 'Medya seçilemedi.');
    }
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setLocation((prev) => ({
      ...prev,
      latitude,
      longitude,
    }));

    Location.reverseGeocodeAsync({ latitude, longitude }).then((address) => {
      const newAddress = address[0];
      setLocation((prev) => ({
        ...prev,
        city: newAddress.city || 'Bilinmiyor',
        country: newAddress.country || 'Bilinmiyor',
      }));
    });
  };

  const handleShare = async () => {
    if (!mediaUri) {
      Alert.alert('Uyarı', 'Önce bir medya seçin.');
      return;
    }

    if (!location) {
      Alert.alert('Uyarı', 'Lütfen konum bilgisi ekleyin.');
      return;
    }

    setLoading(true);

    try {
      // Medyayı Firebase Storage'a yükle
      const mediaRef = ref(storage, `stories/${currentUserId}/${Date.now()}.jpg`);
      const img = await fetch(mediaUri);
      const bytes = await img.blob();
      await uploadBytes(mediaRef, bytes);
      const mediaUrl = await getDownloadURL(mediaRef);

      // Firestore'dan çekilen kullanıcı bilgilerini kullan
      const storyData = {
        userId: currentUserId,
        username: userInfo?.username || 'Anonim', // Firestore'dan kullanıcı adı
        profileImage: userInfo?.profileImage || 'https://via.placeholder.com/150', // Firestore'dan profil resmi
        mediaUrl,
        description,
        timestamp: new Date(),
        location: {
          latitude: location.latitude,
          longitude: location.longitude,
          city: location.city,
          country: location.country,
        },
      };

      console.log('Story Data:', storyData);

      // Firestore'a kaydet
      await addDoc(collection(db, 'stories'), storyData);

      Alert.alert('Başarılı', 'Story başarıyla yüklendi.');
      navigation.goBack();
    } catch (error) {
      console.error('Story paylaşma hatası:', error);
      Alert.alert('Hata', 'Story paylaşılırken hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Yeni Hikaye</Text>
      </View>

      <TouchableOpacity style={styles.mediaPreview} onPress={pickImage}>
        {mediaUri ? (
          <Image source={{ uri: mediaUri }} style={styles.media} resizeMode="cover" />
        ) : (
          <Ionicons name="image-outline" size={100} color="#ccc" />
        )}
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Bir şeyler yaz..."
        value={description}
        onChangeText={setDescription}
      />

      <MapView
        style={styles.map}
        region={
          location
            ? {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
        }
        onPress={handleMapPress} // Haritada tıklanarak yeni konum seçilebiliyor
      >
        {location && <Marker coordinate={location} />}
      </MapView>

      <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.shareButtonText}>Paylaş</Text>
        )}
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 30,
    
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  mediaPreview: {
    width: screenWidth - 40,
    height: screenHeight * 0.4,
    backgroundColor: '#eaeaea',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  media: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  map: {
    width: '100%',
    height: 150,
    marginBottom: 20,
    borderRadius: 10,
  },
  shareButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  shareButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default StoryUpload;
