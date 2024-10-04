import React from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';

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
            {/* Header with enlarged search box */}
            <View style={styles.header}>
              <Text style={styles.title}>Arkadaşlarına Gönder</Text>
              <View style={styles.searchBox}>
                <Feather name="search" size={24} color="#333" />
              </View>
            </View>

            {/* Horizontal list of users with 4 per row */}
            <View style={styles.friendsList}>
              {['yasmin', 'selinay', 'mert', 'cihan', 'furkan', 'ahmet', 'esra', 'ali'].map((friend, index) => (
                <View key={index} style={styles.friend}>
                  <View style={styles.friendImagePlaceholder} />
                  <Text style={styles.friendName}>{friend}</Text>
                  <Text style={styles.moreIndicator}></Text>{/* More indicator for the second row */}
                </View>
              ))}
            </View>

            {/* Share Options with smaller text */}
            <View style={styles.actionsRow}>
              {[
                { icon: "plus", label: "Hikayeye Ekle" },
                { icon: "calendar", label: "Rezervasyon Yap" },
                { icon: "link", label: "Bağlantıyı Kopyala" },
                { icon: "share", label: "Paylaş..." }
              ].map((action, index) => (
                <View key={index} style={styles.actionItem}>
                  <View style={styles.iconContainer}>
                    <Feather name={action.icon} size={30} color="white" />
                  </View>
                  <Text style={styles.actionText}>{action.label}</Text>
                </View>
              ))}
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
    width: 150, // Increased width for search box
    height: 40, // Increased height for search box
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allow wrapping to the next line
    justifyContent: 'space-between',
    marginBottom: 5,
    alignContent:'center'
  },
  friend: {
    alignItems: 'center',
    width: '22%', // Set width for each friend item (4 items per row)
    marginBottom: 15
  },
  friendImagePlaceholder: {
    width:60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ddd',
    marginBottom: 5,
  },
  friendName: {
    fontSize: 12,
    color: '#333',
    fontFamily:'ms-regular'
  },
  moreIndicator: {
    fontSize: 10,
    color: '#888',
    marginTop: 3,
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
    fontSize: 10, // Smaller text size for actions
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF', // Circle background color
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default ShareModal;
