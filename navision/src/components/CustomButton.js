// CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

const CustomButton = ({ title, onPress, backgroundColor = '#1995AD', textColor = '#FFF' }) => {
  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }]} onPress={onPress}>
      <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    flex: 1,
    marginHorizontal: 10, // Butonlar arasında boşluk
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center', // Metni ortala
  },
});

export default CustomButton;
