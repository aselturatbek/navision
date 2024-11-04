import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
//screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import PostUpload from '../mediaupload/PostUpload';
import LoopScreen from '../screens/LoopScreen';
import ProfileScreen from '../screens/ProfileScreen';
import Default2 from '../screens/Default2';
import MessageScreen from '../screens/MessageScreen';
import UserPosts from '../screens/profilescreen/UserPosts';
//icons
import HomeIcon from '../assets/icons/HomeIcon';
import SearchIcon from '../assets/icons/SearchIcon';
import PlusIcon from '../assets/icons/PlusIcon';
import LoopIcon from '../assets/icons/LoopIcon';
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
            tabBarIcon: ({ color, focused }) => <PlusIcon color={focused ? "black" : color} />,
            unmountOnBlur: true, // PostUpload ekranı her açıldığında yeniden yüklensin
            tabBarStyle: { display: 'none' }, // Gizlemek için tabBarStyle ayarını da ekleyelim
          }}
        />
      <Tab.Screen 
        name="Loop" 
        component={LoopScreen} 
        options={{ 
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => <LoopIcon size={25} color={focused ? "black" : color} />
        }} 
      />
      <Tab.Screen 
        name="Default2" 
        component={Default2}
        options={{ 
          tabBarLabel: () => null,
          tabBarIcon: ({ color, focused }) => <BagIcon size={25} color={focused ? "black" : color} /> 
        }} 
      />
      <Tab.Screen
        name="Profile" // Yeni sayfa
        component={ProfileScreen}
        options={{
          tabBarButton: () => null, // Simgeyi gizliyoruz
        }}
      />
       <Tab.Screen
        name="MessageScreen" // Yeni sayfa
        component={MessageScreen}
        options={{
          tabBarButton: () => null, // Simgeyi gizliyoruz
        }}
      />
      <Tab.Screen
        name="UserPosts" // Yeni sayfa
        component={UserPosts}
        options={{
          tabBarButton: () => null, // Simgeyi gizliyoruz
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomNavigation;
