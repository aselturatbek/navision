import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import HomeIcon from '../assets/icons/HomeIcon';
import SearchIcon from '../assets/icons/SearchIcon';
import PlusIcon from '../assets/icons/PlusIcon';
import LoopIcon from '../assets/icons/LoopIcon';
import BagIcon from '../assets/icons/BagIcon';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            onPress={onPress}
            style={styles.tabItem}
          >
            {route.name === 'Home' && <HomeIcon size={25} color={isFocused ? 'white' : 'gray'} />}
            {route.name === 'Search' && <SearchIcon size={25} color={isFocused ? 'white' : 'gray'} />}
            {route.name === 'PostUpload' && <PlusIcon size={25} color={isFocused ? 'white' : 'gray'} />}
            {route.name === 'Loop' && <LoopIcon size={25} color={isFocused ? 'white' : 'gray'} />}
            {route.name === 'Default2' && <BagIcon size={25} color={isFocused ? 'white' : 'gray'} />}
            <Text style={{ color: isFocused ? 'white' : 'gray', fontSize: 10 }}>{route.name}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderTopColor: 'gray',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  tabItem: {
    alignItems: 'center',
  },
});

export default CustomTabBar;
