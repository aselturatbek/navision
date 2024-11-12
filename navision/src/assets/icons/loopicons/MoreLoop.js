import React from 'react';
import Svg, { Circle } from 'react-native-svg';

const MoreIcon = (props) => (
  <Svg
    width={17}
    height={5}
    viewBox="0 0 17 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx="2.5" cy="2.5" r="2.5" fill="white" />
    <Circle cx="8.5" cy="2.5" r="2.5" fill="white" />
    <Circle cx="14.5" cy="2.5" r="2.5" fill="white" />
  </Svg>
);

export default MoreIcon;
