import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const SideMenu = ({ visible, onClose }) => {
  const navigation = useNavigation();
  const auth = getAuth();

  // Oturum değişikliğini izlemek için dinleyici ekliyoruz.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // Kullanıcı oturumdan çıktıysa Login ekranına yönlendir.
        navigation.replace('Login');
      }
    });

    // Dinleyiciyi temizlemek için geri döndürüyoruz.
    return unsubscribe; // Direkt olarak unsubscribe'ı döndürüyoruz, bu bir işlevdir ve bileşen unmount olduğunda çağrılır.
  }, [auth, navigation]);

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Çıkış işlemi asenkron yapıldı.
      Alert.alert('Çıkış Yapıldı', 'Başarıyla çıkış yapıldı.');
    } catch (error) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} onPress={onClose}>
        <View style={styles.dropdown}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Profile')}>
            <Icon name="person-outline" size={20} color="#007BFF" />
            <Text style={styles.menuItemText}>Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Settings')}>
            <Icon name="settings-outline" size={20} color="#007BFF" />
            <Text style={styles.menuItemText}>Ayarlar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
            <Icon name="log-out-outline" size={20} color="#FF4B4B" />
            <Text style={[styles.menuItemText, { color: '#FF4B4B' }]}>Çıkış Yap</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  dropdown: {
    marginTop: 50,
    marginRight: 10,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'ms-regular',
    marginLeft: 10,
    color: '#333',
  },
});

export default SideMenu;
