
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { db, storage } from '../../firebase'; 
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc, setDoc, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
//expo
import * as Font from 'expo-font';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Audio } from 'expo-av'; // Ses kaydı ve oynatma için
import { Animated } from 'react-native';

//icons
import BackIcon from '../../assets/icons/chaticons/BackIcon';
import VideoCallIcon from '../../assets/icons/chaticons/VideoCallIcon';
import PhoneIcon from '../../assets/icons/chaticons/PhoneIcon';
import SendMessage from '../../assets/icons/chaticons/SendMessage';
import VoiceMessage from '../../assets/icons/chaticons/VoiceMessage';
import CameraIcon from '../../assets/icons/chaticons/CameraIcon';

const ChatScreen = ({ route,navigation }) => {
  const { user } = route.params;
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [recording, setRecording] = useState(null);
  const [sound, setSound] = useState(null); // Kaydedilen ses dosyasını çalmak için
  const [recordedUri, setRecordedUri] = useState(null); // Ses kaydının URI'si
  const flatListRef = useRef(null);
  //animation
  const inputAnimation = useRef(new Animated.Value(0)).current;
  const animateInputUp = () => {
    Animated.timing(inputAnimation, {
      toValue: 1, // Yukarı hareket ettirmek için
      duration: 300, // 300ms'de animasyon gerçekleşir
      useNativeDriver: true,
    }).start();
  };
  
  const animateInputDown = () => {
    Animated.timing(inputAnimation, {
      toValue: 0, // Aşağı geri getirmek için
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  

  // chatId oluşturma
  const chatId = currentUser.uid > user.userId 
    ? `${currentUser.uid}_${user.userId}` 
    : `${user.userId}_${currentUser.uid}`;

  useEffect(() => {
    const q = query(
      collection(db, 'Chats', chatId, 'Messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(fetchedMessages); 
    });

    return unsubscribe;
  }, [chatId]);
  const sendMessage = async () => {
    if (!newMessage.trim() && !selectedMedia && !recordedUri) return;
  
    const messageData = {
      text: newMessage,
      senderId: currentUser.uid,
      receiverId: user.userId,
      timestamp: serverTimestamp(),
      isRead: false,
    };
  
    if (selectedMedia) {
      const response = await fetch(selectedMedia);
      const blob = await response.blob();
      const mediaRef = ref(storage, `media/${new Date().getTime()}-media`);
      const snapshot = await uploadBytes(mediaRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      messageData.mediaUrl = downloadUrl;
      setSelectedMedia(null);
    }
  
    if (recordedUri) {
      const response = await fetch(recordedUri);
      const blob = await response.blob();
      const audioRef = ref(storage, `audio/${new Date().getTime()}-audio`);
      const snapshot = await uploadBytes(audioRef, blob);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      messageData.audioUrl = downloadUrl;
      setRecordedUri(null);
    }
  
    try {
      // Mesajı 'Chats' koleksiyonuna ekle
      await addDoc(collection(db, 'Chats', chatId, 'Messages'), messageData);
  
      // 'chats' koleksiyonundaki son mesaj ve zaman damgasını güncelle
      const chatRef = doc(db, 'chats', chatId);
      await setDoc(chatRef, {
        lastMessage: messageData.text || 'Medya gönderildi',
        lastMessageTimestamp: serverTimestamp(),
        users: [currentUser.uid, user.userId],
        lastMessageSender: currentUser.uid
      }, { merge: true });
  
      setNewMessage('');
    } catch (error) {
      console.error("Mesaj gönderilirken hata oluştu:", error);
    }
  };
  
  // Medya seçme fonksiyonu
  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedMedia(result.uri);
    }
  };

  // Ses kaydı başlatma fonksiyonu
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        
        const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
        setRecording(recording);
        console.log("Ses kaydı başlatıldı.");
      } else {
        console.error("Ses kaydı için izin verilmedi.");
      }
    } catch (error) {
      console.error("Ses kaydedilirken hata oluştu:", error);
    }
  };

  // Ses kaydını durdurma ve kaydetme fonksiyonu
  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      setRecordedUri(uri); // Kayıt URI'sini kaydet
      console.log("Ses kaydı durduruldu ve dosya kaydedildi:", uri);
    } catch (error) {
      console.error("Ses kaydedilirken hata oluştu:", error);
    }
  };

  // Kayıtlı sesi çalma fonksiyonu
  const playRecordedAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: recordedUri });
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Ses oynatılırken hata oluştu:", error);
    }
  };

  // Ses kaydını yollama fonksiyonu
  const sendRecordedAudio = async () => {
    if (!recordedUri) return;

    const response = await fetch(recordedUri);
    const blob = await response.blob();
    const mediaRef = ref(storage, `audio/${new Date().getTime()}-audio`);
    const snapshot = await uploadBytes(mediaRef, blob);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    const messageData = {
      senderId: currentUser.uid,
      receiverId: user.userId,
      timestamp: serverTimestamp(),
      isRead: false,
      audioUrl: downloadUrl, // Ses dosyasını mesaj olarak gönderiyoruz
    };

    try {
      await addDoc(collection(db, 'Chats', chatId, 'Messages'), messageData);
      setRecordedUri(null); // Ses gönderildikten sonra sıfırlanır
    } catch (error) {
      console.error("Mesaj gönderilirken hata oluştu:", error);
    }
  };

  // Mesajları render etme
  const renderMessageItem = ({ item }) => {
    const isSender = item.senderId === currentUser.uid;

    return (
      <View style={[styles.messageItem, isSender ? styles.sentMessage : styles.receivedMessage]}>
      {item.mediaUrl && <Image source={{ uri: item.mediaUrl }} style={styles.media} />}
      {item.audioUrl && (
        <TouchableOpacity onPress={async () => {
          const { sound } = await Audio.Sound.createAsync({ uri: item.audioUrl });
          setSound(sound);
          await sound.playAsync();
        }}>
          <Text style={styles.audioText}>Ses Dosyasını Dinle</Text>
        </TouchableOpacity>
      )}
      <Text style={[styles.messageText, isSender && styles.sentMessageText]}>{item.text}</Text>
      <Text style={[styles.timestamp, isSender && styles.sentTimestamp]}>
        {new Date(item.timestamp?.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -30:50}
    >
      <View style={styles.header}>
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.navigate('MessageScreen')}>
          <BackIcon/>
        </TouchableOpacity>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <Text style={styles.headerText}>@{user.username}</Text>
        {/* <TouchableOpacity style={styles.videoCall}>
          <VideoCallIcon/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.phoneCall}>
          <PhoneIcon/>
        </TouchableOpacity> */}
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
      />

      {recordedUri && (
        <View style={styles.previewContainer}>
          <TouchableOpacity onPress={playRecordedAudio}>
            <Text style={styles.audioText}>Ses Kaydını Dinle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sendRecordedAudio}>
            <Text style={styles.audioText}>Ses Kaydını Gönder</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickMedia}>
          <CameraIcon/>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Mesaj yaz..."
        />
        {recording ? (
          <TouchableOpacity style={styles.voiceButton}>
            <VoiceMessage/>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.voiceButton}>
            <VoiceMessage/>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <SendMessage/>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 26,
    backgroundColor: 'transparent',
    flex:-10, 
    marginRight:30,
    marginTop:30
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 10,
    marginLeft:20
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'ms-regular',
    color: '#333',
  },
  backIcon: {
    marginLeft:-10,
  },
  videoCall: {
    marginLeft:100,
    position:'static'
  },
  phoneCall: {
    marginLeft:13,
    marginTop:-3
  },
  
  messagesList: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: -10,
  },
  messageItem: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: 'background: rgba(122, 129, 148, 1)',
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: 'rgba(235, 236, 238, 1)',
    alignSelf: 'flex-start',
  },
  sentMessageText: {
    color: '#FFFFFF',  // Beyaz renk
  },
  sentTimestamp: {
    color: '#ddd',  // Beyaz renk
    fontSize:10
  },
  audioText:{
    color:'white',
    fontFamily:'ms-light'


  },
  messageText: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'ms-regular',
  },
  timestamp: {
    fontSize: 10,
    fontFamily: 'ms-regular',
    color: '#999',
  },
  media: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  previewContainer: {
    padding: 10,
  },
  previewMedia: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
  locationText: {
    color: '#007BFF',
    textDecorationLine: 'underline',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'background: rgba(235, 236, 238, 1)',
    alignItems: 'center',
    marginBottom: 20,
    width:360,
    marginLeft:15,
    height:90,
    borderRadius:45,
    

  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontFamily: 'ms-regular',
  },
  button: {
    borderRadius: 30,
    backgroundColor: 'transparent',
    padding: 10,
  },
  mediaButton: {
    marginLeft: 10,
  },
});

export default ChatScreen;
