import React from 'react';
import { View, Modal, TouchableOpacity, Text, StyleSheet ,Image} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import SendStoryIcon from '../assets/icons/ShareModalicons/SendStoryIcon';
import HistoryIcon from '../assets/icons/ShareModalicons/HistoryIcon';
import LinkIcon from '../assets/icons/ShareModalicons/LinkIcon';
import ShareIcon from '../assets/icons/ShareModalicons/ShareIcon';

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
                <Feather name="search" size={18} color="#000" style={styles.searchIcon}/>
              </View>
            </View>

            {/* Horizontal list of users with 4 per row */}
            <View style={styles.friendsList}>
              {['yasmin', 'selinay', 'mert', 'cihan', 'furkan', 'ahmet', 'esra', 'ali'].map((friend, index) => (
              <TouchableOpacity key={index} style={styles.friend}>
                <Image source={require('../assets/images/default_cat.jpg')} style={styles.friendImagePlaceholder} />
                <Text style={styles.friendName}>{friend}</Text>
                <Text style={styles.moreIndicator}></Text>{/* More indicator for the second row */}
              </TouchableOpacity>
              ))}
            </View>
             {/* Horizontal line between Friends List and Share Options */}
             <View style={styles.divider} />
            {/* Share Options with smaller text */}
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.iconContainer}>
                  <SendStoryIcon/>
                </View>
                <Text style={styles.actionText}>Hikayeye{"\n"}    Ekle</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.iconContainer}>
                  <HistoryIcon />
                </View>
                <Text style={styles.actionText}>Rezervasyon {"\n"}        Yap</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.iconContainer}>
                  <LinkIcon />
                </View>
                <Text style={styles.actionText}>Bağlantıyı{"\n"} Kopyala</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionItem}>
                <View style={styles.iconContainer}>
                  <ShareIcon />
                </View>
                <Text style={styles.actionText}>Paylaş...</Text>
              </TouchableOpacity>
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
    height:'50%',
    justifyContent:'space-around',
    shadowColor: '#fff',
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  title: {
    fontSize: 14,
    color: '#000000',
    fontFamily:'ms-bold',
    marginTop:2
  },
  searchBox: {
    width: 150, // Increased width for search box
    height: 25, // Increased height for search box
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchIcon:{
    alignSelf:'flex-start',
    fontSize:14,
    color:'#000'
  },
  friendsList: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    justifyContent: 'space-around',
    marginBottom: 0,
    alignContent:'center'
  },
  friend: {
    alignItems: 'center',
    width: '22%', // Set width for each friend item (4 items per row)
    marginBottom: 10
  },
  friendImagePlaceholder: {
    width:65,
    height: 65,
    borderRadius: 35,
    backgroundColor: '#ddd',
    marginBottom: 5,
  },
  friendName: {
    fontSize: 12,
    color: '#333',
    fontFamily:'ms-regular',
    marginBottom:-10
  },
  moreIndicator: {
    fontSize: 10,
    color: '#888',
    marginTop: 3,
  },
  divider: {
    height: 1, // Çizginin kalınlığı
    backgroundColor: '#ccc', // Çizginin rengi
    marginTop: 10, // Çizgi üst ve altındaki boşluk
    marginBottom:20
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionItem: {
    alignItems: 'center',

  },
  actionText: {
    color: '#000',
    marginTop: 5,
    fontSize: 10,
    fontFamily:'ms-regular'
  },
  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: 'rgba(43, 47, 50, 0.3)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
});

export default ShareModal;
