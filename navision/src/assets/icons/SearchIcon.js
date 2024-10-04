import React from 'react';
import { Svg, Path } from 'react-native-svg';

const SearchIcon = ({color = "#848181"}) => {
  return (
    <Svg width="26" height="26" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path 
        d="M23 12C23 18.072 18.072 23 12 23C5.928 23 1 18.072 1 12C1 5.928 5.928 1 12 1C18.072 1 23 5.928 23 12Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <Path 
        d="M20.5 21L27.5 28" 
        stroke={color} 
        strokeWidth="1.5"
      />
    </Svg>
  );
};

export default SearchIcon;
