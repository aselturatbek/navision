import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Alert, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
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

const PostUpload = ({ navigation }) => {
  const [step, setStep] = useState(1); // Adım durumu
  const [mediaUrls, setMediaUrls] = useState([]);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
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
      allowsMultipleSelection: true,
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
    
    const extension = uri.split('.').pop();
    const uniqueFileName = `posts/${username}_${Date.now()}_${index}.${extension}`;
    const mediaRef = storageRef(storage, uniqueFileName);
    
    await uploadBytes(mediaRef, blob);
    const downloadUrl = await getDownloadURL(mediaRef);
    
    return { uri: downloadUrl, fileName: uniqueFileName };
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
      Alert.alert('Error', 'Please select media and location.');
      return;
    }

    setLoading(true);

    try {
      const uploadedMediaUrls = await Promise.all(
        mediaUrls.map(async (media, index) => {
          const { uri: downloadUrl, fileName } = await uploadMedia(media.uri, index, userInfo.username || 'username');
          return { uri: downloadUrl, fileName, type: media.type };
        })
      );

      const currentUser = auth.currentUser;

      const postData = {
        userId: currentUser.uid,
        username: userInfo.username || 'username',
        profileImage: userInfo.profileImage || 'https://via.placeholder.com/150',
        mediaUrls: uploadedMediaUrls.map(media => media.uri),
        mediaFileNames: uploadedMediaUrls.map(media => media.fileName),
        description,
        location: {
          city,
          country,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        mediaType: uploadedMediaUrls.length > 1 ? 'carousel' : uploadedMediaUrls[0].type,
        timestamp: serverTimestamp(),
        likes: 0,
        commentsCount: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        likedBy: [],
        commentedBy: [],
        savedBy: [],
      };

      await addDoc(collection(firestore, 'posts'), postData);

      Alert.alert('Success', 'Post uploaded!');
      resetForm();
      navigation.navigate('Home', { location });
    } catch (error) {
      console.error('Error uploading post:', error);
      Alert.alert('Error', 'Failed to upload post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMediaPreview = ({ item: media, index }) => {
    if (!media) return null;
    
    if (media.type === 'video') {
      return (
        <View key={index} style={styles.mediaWrapper}>
          <Video
            source={{ uri: media.uri }}
            style={styles.media}
            resizeMode="contain"
            useNativeControls
            onPlaybackStatusUpdate={(status) => {
              if (!status.isPlaying && status.didJustFinish) {
                videoRef.current?.stopAsync(); // Video bittiğinde durdur
              }
            }}
          />
          <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(index)}>
            <Text style={styles.removeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
      <View key={index} style={styles.mediaWrapper}>
        <Image source={{ uri: media.uri }} style={styles.media} />
        <TouchableOpacity style={styles.removeButton} onPress={() => removeMedia(index)}>
          <Text style={styles.removeButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  

  return (
    <View style={styles.container}>
      {step === 1 ? (
        <View style={styles.firstStepContainer1}>
        <View style={styles.headerContainer1}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={styles.backButtonText1}>Geri</Text>
          </TouchableOpacity>
          <Text style={styles.headerText1}>Paylaşım Yap</Text>
          <TouchableOpacity onPress={() => setStep(1.5)}>
            <Text style={styles.confirmButtonText1}>Onayla</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={mediaUrls}
          renderItem={renderMediaPreview}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.mediaContainer1}
        />
      
        <TouchableOpacity style={styles.captureButton1} onPress={pickMedia}>
          <Text style={styles.buttonText1}>Fotoğraf / Video</Text>
        </TouchableOpacity>
      </View>
      
      ) : (
        <View style={styles.secondStepContainer}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
          <MapView style={styles.map} region={region} onPress={handleLocationSelect}>
            {location && (
              <Marker coordinate={location} pinColor="red" title={`${city}, ${country}`} />
            )}
          </MapView>
          <TextInput
            style={styles.input}
            placeholder="Açıklama ekle..."
            value={description}
            onChangeText={setDescription}
          />
          <View style={styles.mediaContainer}>
            {mediaUrls.map((media, index) => renderMediaPreview(media, index))}
          </View>
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPost}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Paylaş</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    marginTop:0
  },
  firstStepContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondStepContainer: {
    flex: 1,
    padding: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  mediaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  mediaWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  media: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign:'left',
    marginTop:50
  },
  confirmButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'ms-bold',
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  firstStepContainer1: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: 15,
    paddingTop: 45,
  },
  headerContainer1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  backButtonText1: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'ms-regular',
  },
  headerText1: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'ms-bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 30,
  },
  confirmButtonText1: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'ms-regular',
  },
  mediaContainer1: {
    flex: 1,
    marginVertical: 10,
  },
  mediaWrapper: {
    width: 300, // Daha büyük boyut
    height: 400,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  captureButton1: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
  buttonText1: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  });

export default PostUpload;
