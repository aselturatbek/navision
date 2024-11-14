import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import * as Location from 'expo-location';
//firebase
import { getFirestore, collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Icons
import CancelIcon from '../assets/icons/postuploadicons/CancelIcon';
import AcceptIcon from '../assets/icons/postuploadicons/AcceptIcon';
import CameraIcon from '../assets/icons/postuploadicons/CameraIcon';
import CaptureIcon from '../assets/icons/postuploadicons/CaptureIcon';
import TurnIcon from '../assets/icons/postuploadicons/TurnIcon';

const LoopUpload = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [loopUrl, setLoopUrl] = useState([]); // Başlangıçta bir dizi
  const [location, setLocation] = useState(null);
  const [loopDescription, setLoopDescription] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [userInfo, setUserInfo] = useState({});
  const [region, setRegion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [mediaData, setMediaData] = useState([]);
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
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
  
      // Varsayılan ülke ve şehir ayarı
      try {
        const address = await Location.reverseGeocodeAsync({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
        if (address.length > 0) {
          setCity(address[0].city || '');
          setCountry(address[0].country || '');
        }
      } catch (error) {
        console.error('Error reverse geocoding default location:', error);
      }
    })();
  }, [auth, firestore]);
  
  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        const videoUri = result.assets[0]?.uri;
        if (videoUri) {
          setLoopUrl((prev) => [...prev, videoUri]); // Diziye ekleme
          setMediaData((prevData) => [
            ...prevData,
            { id: Date.now().toString(), uri: videoUri, type: 'video' },
          ]);
        } else {
          Alert.alert('Error', 'Video URI not found.');
        }
      } else {
        Alert.alert('Cancelled', 'Video selection was cancelled.');
      }
    } catch (error) {
      console.error('Error picking video:', error);
      Alert.alert('Error', 'An error occurred while selecting the video.');
    }
  };
  const resetForm = () => {
    setLoopUrl([]);
    setLoopDescription('');
    setLocation(null);
    setCity('');
    setCountry('');
  };
  const uploadMedia = async (uri, index, username) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const extension = uri.split('.').pop();
    const uniqueFileName = `loops/${username}_${Date.now()}_${index}.${extension}`;
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

  const handleLocationSelect = async (e) => {
    try {
      const { latitude, longitude } = e.nativeEvent.coordinate;
  
      if (!latitude || !longitude) {
        throw new Error('Latitude or Longitude is missing.');
      }
  
      setLocation({ latitude, longitude });
  
      const address = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
  
      if (address.length > 0) {
        setCity(address[0].city || 'Unknown City');
        setCountry(address[0].country || 'Unknown Country');
      } else {
        throw new Error('No address found for the selected location.');
      }
    } catch (error) {
      console.error('Error reverse geocoding selected location:', error.message);
      Alert.alert('Error', error.message || 'Failed to get location details.');
    }
  };
  
  
  const handlePostLoop = async () => {
    if (loopUrl.length === 0 || !location) {
      Alert.alert('Error', 'Please select media and location.');
      return;
    }

    setLoading(true);

    try {
      const uploadedMediaUrls = await Promise.all(
        loopUrl.map(async (uri, index) => {
          const { uri: downloadUrl, fileName } = await uploadMedia(uri, index, userInfo.username || 'username');
          return { uri: downloadUrl, fileName, type: 'video' };
        })
      );

      const currentUser = auth.currentUser;

      const loopData = {
        userId: currentUser.uid,
        username: userInfo.username || 'username',
        profileImage: userInfo.profileImage || 'https://via.placeholder.com/150',
        loopUrl: uploadedMediaUrls.map((media) => media.uri),
        description: loopDescription,
        location: {
          city,
          country,
          latitude: location.latitude,
          longitude: location.longitude,
        },
        timestamp: serverTimestamp(),
        likes: 0,
        commentsCount: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        sents:0,
        sentBy:[],
        likedBy: [],
        commentedBy: [],
        savedBy: [],
      };

      await addDoc(collection(firestore, 'loops'), loopData);

      Alert.alert('Success', 'Loop uploaded!');
      resetForm();
      navigation.navigate('Home', { location });
    } catch (error) {
      console.error('Error uploading loop:', error);
      Alert.alert('Error', 'Failed to upload loop. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderMediaPreview = ({ item: media }) => {
    return (
      <View style={styles.mediaWrapper}>
        <Video
          source={{ uri: media.uri }}
          style={styles.media}
          resizeMode="contain"
          useNativeControls
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {step === 1 ? (
        <View style={styles.firstStepContainer1}>
          <View style={styles.headerContainer1}>
            <TouchableOpacity onPress={() => navigation.navigate('Loop')}>
              <CancelIcon style={styles.cancelIcon} />
            </TouchableOpacity>
            <Text style={styles.headerText1}>Paylaşım Yap</Text>
            <TouchableOpacity onPress={() => setStep(1.5)}>
              <AcceptIcon />
            </TouchableOpacity>
          </View>
          <FlatList
            data={mediaData}
            renderItem={renderMediaPreview}
            keyExtractor={(item) => item.id}
           
            style={styles.mediaContainer1}
          />
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={styles.imageText}
              onPress={() => navigation.navigate('PostUpload')}
            >
              <Text style={styles.fotograf}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.videoText} onPress={pickVideo}>
              <Text style={styles.fotograf}>Loop</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer}>
          <TouchableOpacity onPress={pickVideo} style={styles.cameraIcon} >
            <CameraIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickVideo} style={styles.captureIcon}>
            <CaptureIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.turnIcon}  >
            <TurnIcon />
          </TouchableOpacity>
        </View>
        </View>
      ) : (
        <View style={styles.secondStepContainer}>
          <TouchableOpacity onPress={() => setStep(1)}>
            <Text style={styles.backButtonText}>Geri</Text>
          </TouchableOpacity>
          <MapView
            style={styles.map}
            region={region}
            onPress={handleLocationSelect}
          >
            {location && (
              <Marker
                coordinate={location}
                pinColor="red"
                title={`${city}, ${country}`}
              />
            )}
          </MapView>

          <TextInput
            style={styles.input}
            placeholder="Açıklama ekle..."
            value={loopDescription}
            onChangeText={setLoopDescription}
          />
          <TouchableOpacity style={styles.uploadButton} onPress={handlePostLoop}>
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
  mediaWrapper: {
    height: '100%', // Kapsayıcı yüksekliği tam ekran
    width: '100%',  // Kapsayıcı genişliği tam ekran
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
    position: 'relative', // İçerik için konumlandırma
  },
  media: {
    ...StyleSheet.absoluteFillObject, // Kapsayıcı alanı tamamen doldurur
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
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
  cancelIcon: {
    marginTop: 40,
  },
  headerText1: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'ms-bold',
    textAlign: 'center',
    flex: 1,
  },
  mediaContainer1: {
    height: '100%', // Kapsayıcı yüksekliği tam ekran
    width: '100%',  // Kapsayıcı genişliği tam ekran
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
    position: 'relative', // İçerik için konumlandırma
    marginTop:10,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 85,
    paddingVertical: 60,
    backgroundColor: '#000',
  },
  imageText: {
    backgroundColor: 'transparent',
    width: 100,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoText: {
    backgroundColor: 'rgba(26, 34, 42, 1)',
    width: 100,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fotograf: {
    color: 'white',
    fontFamily: 'ms-light',
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#000',
  },
  cameraIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 80,
  },
  turnIcon: {
    marginBottom: 70,
    marginRight: 10,
  },
  captureIcon: {
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
  },
  secondStepContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  backButtonText: {
    color: '#000',
    fontSize: 16,
    marginTop: 50,
  },
  map: {
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'ms-bold',
  },
});

export default LoopUpload;
