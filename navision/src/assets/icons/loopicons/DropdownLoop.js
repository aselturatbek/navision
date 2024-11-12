import React from 'react';
import Svg, { Path } from 'react-native-svg';

const DropDownLoop = ({ width = 13, height = 8, color = "white", ...props }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 13 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M1 1L6.5 6.5L12 1"
      stroke={color}
    />
  </Svg>
);

export default DropDownLoop;
