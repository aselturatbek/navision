import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import MessageScreen from '../screens/MessageScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Feather } from 'react-native-vector-icons'; // Feather icons

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Header = ({ onMenuPress }) => {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 18, backgroundColor: 'transparent', marginTop:30 }}>
      <TouchableOpacity onPress={onMenuPress}>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>NAVISION</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <Feather name="bell" size={25} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <Feather name="message-circle" size={25} color="black" />
        </TouchableOpacity>
        <Image 
          source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Koala_climbing_tree.jpg/640px-Koala_climbing_tree.jpg' }} // Profil fotoğrafı
          style={{ width: 40, height: 40, borderRadius: 20 }}
        />
      </View>
    </View>
  );
};

const HomeTabs = ({ route, navigation }) => {
  const { username, email } = route.params || {};

  const openMenu = () => {
    console.log('menu opened!!!');
  };

  return (
    <>
      <Header onMenuPress={openMenu} />
      <Tab.Navigator screenOptions={{ headerShown: false,tabBarStyle: { backgroundColor: 'transparent', borderTopWidth:0 } }} >
        <Tab.Screen 
          name="Home" 
          children={() => <HomeScreen username={username} />} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({color}) => <Feather name="home" size={25} color= {color}/> 
           }} 
        />
        <Tab.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({color}) => <Feather name="search" size={25} color={color}/>
          }}
        />
        <Tab.Screen 
          name="Messages" 
          component={MessageScreen} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({color}) => <Feather name="message-circle" size={25} color={color}/>
           }} 
        />
        <Tab.Screen 
          name="Profile" 
          children={() => <ProfileScreen username={username} email={email} />} 
          options={{ 
            tabBarLabel: () => null,
            tabBarIcon: ({color}) => <Feather name="user" size={25} color={color}/>
           }} 
        />
      </Tab.Navigator>
    </>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="HomeTabs" component={HomeTabs}options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
