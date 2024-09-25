import React from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({navigation}) => {
  return (
    <View>
      <Text>Home Page</Text>
      <Button title="Login" onPress={() => navigation.replace('HomeTabs')} />
      <Button title="Register" onPress={() => navigation.navigate('Register')} />
    </View>
  );
};

export default HomeScreen;
