import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Alert, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Video } from 'expo-av';
import * as ImageManipulator from 'expo-image-manipulator';

const resizeImage = async (uri) => {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 800 } }],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulatedImage.uri;
};

const StoryUpload = ({ navigation }) => {
  const [mediaUrls, setMediaUrls] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false); // Yükleme durumu için state
  const videoRef = useRef(null);
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
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserInfo();

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'You need to grant location permission.');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setLocation(coords);
      setRegion({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
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
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const newMedia = await Promise.all(
        result.assets.map(async (asset) => ({
          uri: asset.type === 'image' ? await resizeImage(asset.uri) : asset.uri,
          type: asset.type,
        }))
      );
      setMediaUrls([...mediaUrls, ...newMedia]);
    }
  };

  const removeMedia = (index) => {
    const updatedMedia = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(updatedMedia);
  };

  const uploadMedia = async (uri, index, username) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const extension = uri.split('.').pop(); // URI'den dosya uzantısını al
    const uniqueFileName = `stories/${username}_${Date.now()}.${extension}`; // Benzersiz hale getirildi

    const mediaRef = storageRef(storage, uniqueFileName);
    
    await uploadBytes(mediaRef, blob);
    const downloadUrl = await getDownloadURL(mediaRef);
    
    return { uri: downloadUrl, fileName: uniqueFileName }; // İki değeri döndür
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

  const handleUploadStory = async () => {
    if (mediaUrls.length === 0 || !location) {
      Alert.alert('Error', 'Please select media and location.');
      return;
    }

    setLoading(true); // Yükleme başladığında true olarak ayarla
  
    try {
      const uploadedMediaUrls = await Promise.all(
        mediaUrls.map(async (media, index) => {
          const { uri: downloadUrl, fileName } = await uploadMedia(media.uri, index, userInfo.username || 'username');
          return { uri: downloadUrl, fileName, type: media.type }; // fileName'i ekle
        })
      );
  
      const currentUser = auth.currentUser;
  
      const storyData = {
        userId: currentUser.uid,
        username: userInfo.username || 'username',
        profileImage: userInfo.profileImage || 'https://via.placeholder.com/150',
        mediaUrls: uploadedMediaUrls.map(media => media.uri), // Sadece URL'leri kaydet
        mediaFileNames: uploadedMediaUrls.map(media => media.fileName), // Dosya adlarını kaydet
        description,
        location: {
          city,
          country,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        mediaType: uploadedMediaUrls[0].type, // Sadece tek tip media türünü kullan
        timestamp: serverTimestamp(),
      };
  
      await addDoc(collection(firestore, 'stories'), storyData);
  
      Alert.alert('Success', 'Story uploaded!');
      console.log(storyData);
      resetForm();
      navigation.navigate('Home', { location });
    } catch (error) {
      console.error('Error uploading story:', error);
      Alert.alert('Error', 'Failed to upload story. Please try again.');
    } finally {
      setLoading(false); // Yükleme tamamlandığında false olarak ayarla
    }
  };
  
  const renderMediaPreview = (media, index) => {
    if (media.type === 'video') {
      return (
        <View key={index} style={styles.mediaWrapper}>
          <Video
            source={{ uri: media.uri }}
            style={styles.media}
            resizeMode="contain"
            useNativeControls
            shouldPlay={false}
            onLoad={() => videoRef.current?.playAsync()}
          />
          <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(index)}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View key={index} style={styles.mediaWrapper}>
        <Image source={{ uri: media.uri }} style={styles.media} />
        <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(index)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
        <Text style={styles.buttonText}>Select Media</Text>
      </TouchableOpacity>

      <View style={styles.mediaContainer}>
        {mediaUrls.map((media, index) => renderMediaPreview(media, index))}
      </View>

      <TextInput
        style={styles.input}
        placeholder="Add a description..."
        value={description}
        onChangeText={setDescription}
      />

      <MapView style={styles.map} region={region} onPress={handleLocationSelect}>
        {location && (
          <Marker coordinate={location} pinColor="red" title={`${city}, ${country}`} />
        )}
      </MapView>

      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadStory}>
        {loading ? ( // Yükleme durumu kontrolü
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload Story</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: 'transparent'
  },
  mediaButton: {
    backgroundColor: '#3897f0',
    borderRadius: 8,
    padding: 15,
    marginTop: 40,
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    position: 'absolute',
    marginTop: 600,
    alignSelf: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'ms-bold',
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  mediaWrapper: {
    position: 'relative',
  },
  media: {
    width: 100,
    height: 100,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
    fontFamily: 'ms-regular',
  },
  map: {
    width: '100%',
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
  },
});

export default StoryUpload;
