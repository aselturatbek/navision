import React, { useRef, useEffect } from 'react';
import { View, FlatList, Image, Text, StyleSheet } from 'react-native';

const ChatMessages = ({ messages, currentUser }) => {
  const flatListRef = useRef(null);

  const renderMessageItem = ({ item }) => {
    const isSender = item.senderId === currentUser.uid;

    return (
      <View style={[styles.messageItem, isSender ? styles.sentMessage : styles.receivedMessage]}>
        {item.mediaUrl && <Image source={{ uri: item.mediaUrl }} style={styles.media} />}
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>{new Date(item.timestamp?.toDate()).toLocaleTimeString()}</Text>
      </View>
    );
  };

  const scrollToBottom = () => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <FlatList
      ref={flatListRef}
      data={messages}
      renderItem={renderMessageItem}
      keyExtractor={(item) => item.id}
      style={styles.messagesList}
      onContentSizeChange={() => scrollToBottom()} // Mesaj geldikçe en aşağıya kaydır
      onLayout={() => scrollToBottom()} // Ekran ilk yüklendiğinde en aşağıya kaydır
    />
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#DCF8C6',
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
  timestamp: {
    fontSize: 12,
    fontFamily: 'ms-regular',
    color: '#999',
  },
  media: {
    width: 200,
    height: 150,
    borderRadius: 10,
  },
});

export default ChatMessages;
