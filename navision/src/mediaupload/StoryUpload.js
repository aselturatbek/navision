import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, Alert, Image, ScrollView,FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Video } from 'expo-av';
import * as ImageManipulator from 'expo-image-manipulator';
//icons
import CancelIcon from '../assets/icons/postuploadicons/CancelIcon';
import AcceptIcon from '../assets/icons/postuploadicons/AcceptIcon';
import CameraIcon from '../assets/icons/postuploadicons/CameraIcon';
import CaptureIcon from '../assets/icons/postuploadicons/CaptureIcon';
import TurnIcon from '../assets/icons/postuploadicons/TurnIcon';

// Fotoğrafı seçilen oran ile kırpma ve yeniden boyutlandırma
const resizeAndCropImage = async (uri, aspectRatio) => {
  const manipulatedImage = await ImageManipulator.manipulateAsync(
    uri,
    [
      { resize: { width: aspectRatio === '4:5' ? 800 : 800, height: aspectRatio === '4:5' ? 1000 : 800 } },
      { crop: { originX: 0, originY: 0, width: aspectRatio === '4:5' ? 800 : 800, height: aspectRatio === '4:5' ? 1000 : 800 } }
    ],
    { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
  );
  return manipulatedImage.uri;
};

const StoryUpload = ({ navigation }) => {
  const [step, setStep] = useState(1); 
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
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('1:1');

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

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false, // Fotoğrafın düzenlenmesine izin vermiyoruz, böylece kırpma olmuyor
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setMediaUrls([...mediaUrls, { uri: result.assets[0].uri, type: 'image' }]);
    }
  };
  
  // Video seçme işlemi
  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    });
  
    if (!result.canceled) {
      setMediaUrls([...mediaUrls, { uri: result.uri, type: 'video' }]);
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
            ref={videoRef}
            onPlaybackStatusUpdate={(status) => {
              if (!status.isPlaying && status.didJustFinish) {
                videoRef.current?.stopAsync();
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
            <CancelIcon style={styles.cancelIcon}/>
          </TouchableOpacity>
          <Text style={styles.headerText1}>Hikaye Paylaş</Text>
          <TouchableOpacity onPress={() => setStep(1.5)}>
            <AcceptIcon/>
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
         <View style={styles.optionContainer}>
         <TouchableOpacity style={styles.imageText}  >
            <Text style={styles.fotograf}>Fotoğraf</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.videoText}  >
            <Text style={styles.fotograf}>Video</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.liveText}  >
            <Text style={styles.fotograf}>Canlı</Text>
          </TouchableOpacity>
        </View>
       <View style={styles.iconContainer}>
          <TouchableOpacity onPress={pickPhoto} style={styles.cameraIcon} >
            <CameraIcon />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickPhoto} style={styles.captureIcon}>
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
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadStory}>
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
    backgroundColor:'white'
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
    height:400,
    width:400 
  },
  mediaWrapper: {
    height:400,
    width:400,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
  },
  media: {
    height:400,
    width:400 
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
    marginBottom:80
  },
  turnIcon:{
    marginBottom:70,
    marginRight:10

  },
  captureIcon: {
    width: 70, // Büyük ikon boyutu
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:70
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 85,
    paddingVertical: 60,
    backgroundColor: '#000',
  },
  imageText:{
    backgroundColor:'rgba(26, 34, 42, 1)',
    width:100,
    height:30,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center'
  },
  videoText:{
    backgroundColor:'transparent',
    width:80,
    height:30,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center'
  },
  liveText:{
    backgroundColor:'transparent',
    width:60,
    height:30,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center'
  },
  fotograf:{
    color:'white',
    fontFamily:'ms-light'
         
  },
  backButtonText: {
    color: '#000',
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
  },
  cancelIcon: {
    marginTop:40,
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
    height:350,
    width:350,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 15,
    marginTop:90
  },
  media: {
    height:400,
    width:400 
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
export default StoryUpload;
