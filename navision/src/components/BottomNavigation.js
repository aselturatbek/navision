import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PostUpload from '../mediaupload/PostUpload';
import DefaultScreen from '../screens/DefaultScreen';
import ProfileScreen from '../screens/ProfileScreen';
import HomeIcon from '../assets/icons/HomeIcon';
import SearchIcon from '../assets/icons/SearchIcon';
import PlusIcon from '../assets/icons/PlusIcon';
import GridIcon from '../assets/icons/GridIcon';
import BagIcon from '../assets/icons/BagIcon';

const Tab = createBottomTabNavigator();

const BottomNavigation = ({ username, profileImage, name, surname }) => {
  return (
    <Tab.Navigator 
      screenOptions={{
        headerShown: false, 
        tabBarStyle: { backgroundColor: 'white', borderTopWidth: 0, elevation: 0, padding: 10, paddingHorizontal: 20 },
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'gray',
      }}
    >
      <Tab.Screen 
        name="Home" 
        children={() => <HomeScreen username={username} profileImage={profileImage} name={name} surname={surname} />} 
        options={{ 
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => <HomeIcon size={25} color={focused ? "black" : color} /> 
        }} 
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ 
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => <SearchIcon size={25} color={focused ? "black" : color} />
        }}
      />
      <Tab.Screen 
        name="PostUpload" 
        component={PostUpload} 
        options={{ 
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => <PlusIcon color={focused ? "black" : color} />
        }}
      />
      <Tab.Screen 
        name="Default" 
        component={DefaultScreen} 
        options={{ 
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => <GridIcon size={25} color={focused ? "black" : color} />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ 
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => <BagIcon size={25} color={focused ? "black" : color} /> 
        }} 
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
