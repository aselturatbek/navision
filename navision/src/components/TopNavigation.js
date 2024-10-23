import React from 'react';
import { View, TouchableOpacity, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NotificationIcon from '../assets/icons/NotificationIcon';
import MessageIcon from '../assets/icons/MessageIcon';
import MoreIcon from '../assets/icons/MoreIcon';

const TopNavigation = ({ onMenuPress, user }) => {
  const navigation = useNavigation();

  
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 18, backgroundColor: 'transparent', marginTop: 30 }}>
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', fontFamily: 'ms-bold', marginTop: 8, marginLeft: 10 }}>
          navision <MoreIcon />
        </Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 5, marginBottom: -15 }}>
          <NotificationIcon size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ marginRight: 16 }} 
          onPress={() => navigation.navigate('MessageScreen')}
        >
          <MessageIcon size={25} color="black" />
        </TouchableOpacity>
        <Image 
          source={{ uri: user?.profileImage || 'https://via.placeholder.com/150' }}
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>
    </View>
  );
};

export default TopNavigation;
