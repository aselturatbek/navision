import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PlusIcon = () => {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path 
        d="M15.0001 1L15.0001 29" 
        stroke="grey" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <Path 
        d="M1 15L29 15" 
        stroke="grey" 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </Svg>
  );
};

export default PlusIcon;
