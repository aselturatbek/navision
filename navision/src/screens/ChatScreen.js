import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image,KeyboardAvoidingView, Platform  } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; // FontAwesome ikonlarını kullanacağız

const ChatScreen = ({ route }) => {
  const { user } = route.params;

  const sendMessage = () => {
    // Mesaj gönderme fonksiyonu
  };

  const renderMessageItem = ({ item }) => {
    const isSender = item.sender === 'me'; // Eğer mesaj gönderici kullanıcıysa sağa hizala

    return (
      <View style={[styles.messageItem, isSender ? styles.sentMessage : styles.receivedMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
     <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined} // iOS için padding, Android için varsayılan davranış
      keyboardVerticalOffset={Platform.OS === 'ios' ? -30 : 0}  // iOS'ta klavye yüksekliği ile ilgili bir kaydırma ekleyebilirsin
    >
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />
        <Text style={styles.headerText}>{user.username}</Text>
      </View>
      <FlatList
        data={user.messages} // user.messages ile mesajları getiriyoruz
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
        style={styles.messagesList}
      />
      <View style={styles.inputContainer}>
       <TouchableOpacity style={styles.mediaButton} onPress={sendMessage}>
          <Text>
            <Icon name="paperclip" size={24} color="#fff" style={styles.mediaIcon} /> {/* Gönder ikonu */}
          </Text>
        </TouchableOpacity>
        <TextInput style={styles.input} placeholder="Mesaj yaz..." placeholderTextColor="#888" />
        <TouchableOpacity style={styles.audioButton} onPress={sendMessage}>
          <Text>
            <Icon name="microphone" size={24} color="#fff" style={styles.audioIcon} /> {/* Gönder ikonu */}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={sendMessage}>
          <Text>
            <Icon name="send" size={24} color="#fff" style={styles.sendIcon} /> {/* Gönder ikonu */}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    marginTop: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 26,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    fontSize: 18,
    fontFamily: 'ms-bold',
    color: '#333',
  },
  messagesList: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  messageItem: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
  },
  sentMessage: {
    backgroundColor: '#DCF8C6', // WhatsApp tarzı gönderilen mesaj rengi
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'ms-regular',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'transparent',
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    fontFamily: 'ms-regular',
  },
  button: {
    borderRadius: 30,
    backgroundColor: '#0095f6',
    padding: 10,
  },
  sendIcon: {
    alignSelf: 'center',
  },
  mediaButton: {
     marginRight: 10,
   },
   audioButton: {
     marginRight: 10,
     borderRadius: 30,
     padding: 10,
   },
   audioIcon:{
     color:'grey'
   },
   mediaIcon:{
     color:'grey'
   }
});

export default ChatScreen;
