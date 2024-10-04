import React from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const ShareModal = ({ visible, onClose }) => {
     const handleGesture = (event) => {
          if (event.nativeEvent.translationY > 100) {
            onClose(); // Close the modal if swipe down exceeds a certain threshold
          }
        };
  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
     <PanGestureHandler onGestureEvent={handleGesture}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Friends List */}
          <View style={styles.header}>
            <Text style={styles.title}>Arkadaşlarına Gönder</Text>
            <View style={styles.searchBox}>
              <Feather name="search" size={18} color="#333" />
            </View>
          </View>

          {/* Horizontal list of users */}
          <View style={styles.friendsList}>
            {['yasmin', 'selinay', 'mert', 'cihan', 'furkan'].map((friend, index) => (
              <View key={index} style={styles.friend}>
                <View style={styles.friendImagePlaceholder} />
                <Text style={styles.friendName}>{friend}</Text>
              </View>
            ))}
          </View>

          {/* Share Options */}
          <View style={styles.actionsRow}>
            <View style={styles.actionItem}>
              <Feather name="plus" size={24} color="white" />
              <Text style={styles.actionText}>Hikayeye Ekle</Text>
            </View>
            <View style={styles.actionItem}>
              <Feather name="calendar" size={24} color="white" />
              <Text style={styles.actionText}>Rezervasyon Yap</Text>
            </View>
            <View style={styles.actionItem}>
              <Feather name="link" size={24} color="white" />
              <Text style={styles.actionText}>Bağlantıyı Kopyala</Text>
            </View>
            <View style={styles.actionItem}>
              <Feather name="share" size={24} color="white" />
              <Text style={styles.actionText}>Paylaş...</Text>
            </View>
          </View>
        </View>
      </View>
      </PanGestureHandler>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  searchBox: {
    width: 100,
    height: 35,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  friend: {
    alignItems: 'center',
  },
  friendImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ddd',
    marginBottom: 5,
  },
  friendName: {
    fontSize: 12,
    color: '#333',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
  },
  actionText: {
    color: '#333',
    marginTop: 5,
    fontSize: 12,
  },
});

export default ShareModal;
