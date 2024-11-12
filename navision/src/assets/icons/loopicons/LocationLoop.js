import React from 'react';
import Svg, { Path } from 'react-native-svg';

const LocationLoop = ({ width = 12, height = 12, color = "white" }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.18199 2.02414C10.0233 2.82575 10.4995 3.93707 10.4995 5.09914C10.4995 6.26122 10.0233 7.37254 9.18199 8.17414L5.99974 11.2491L2.81749 8.17414C1.97615 7.37254 1.5 6.26122 1.5 5.09914C1.5 3.93707 1.97615 2.82575 2.81749 2.02414C4.59888 0.325285 7.40059 0.325285 9.18199 2.02414Z"
      stroke={color}
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.79971 4.83214C7.79319 5.30298 7.59987 5.75194 7.2623 6.08024C6.92472 6.40853 6.47055 6.58925 5.99971 6.58264C5.52887 6.58925 5.07469 6.40853 4.73712 6.08024C4.39954 5.75194 4.20623 5.30298 4.19971 4.83214C4.21369 3.85195 5.01951 3.06863 5.99971 3.08239C6.9799 3.06863 7.78572 3.85195 7.79971 4.83214V4.83214Z"
      stroke={color}
      strokeWidth="1.125"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default LocationLoop;
