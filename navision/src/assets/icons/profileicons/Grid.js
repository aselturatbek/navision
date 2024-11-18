import React from 'react';
import Svg, { Path } from 'react-native-svg';

const Grid = ({ color = 'black', size = 28 }) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.9876 11.6673H7.67898C7.1935 11.6633 6.72629 11.8523 6.38016 12.1927C6.03403 12.5331 5.83732 12.9971 5.83331 13.4826V20.3531C5.8423 21.3636 6.66846 22.1757 7.67898 22.1673H10.9876C11.4731 22.1713 11.9403 21.9823 12.2865 21.6419C12.6326 21.3015 12.8293 20.8375 12.8333 20.352V13.4826C12.8293 12.9971 12.6326 12.5331 12.2865 12.1927C11.9403 11.8523 11.4731 11.6633 10.9876 11.6673Z"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.9876 4.66736H7.67898C6.68878 4.6399 5.86316 5.41906 5.83331 6.40919V7.59219C5.86316 8.58233 6.68878 9.36149 7.67898 9.33403H10.9876C11.9778 9.36149 12.8035 8.58233 12.8333 7.59219V6.40919C12.8035 5.41906 11.9778 4.6399 10.9876 4.66736Z"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.0124 15.1675H20.3199C20.8055 15.1718 21.273 14.9829 21.6194 14.6425C21.9658 14.302 22.1627 13.8378 22.1667 13.3521V6.48279C22.1627 5.9973 21.966 5.53329 21.6198 5.19285C21.2737 4.85241 20.8065 4.66341 20.321 4.66745H17.0124C16.5269 4.66341 16.0597 4.85241 15.7135 5.19285C15.3674 5.53329 15.1707 5.9973 15.1667 6.48279V13.3521C15.1707 13.8376 15.3674 14.3016 15.7135 14.6421C16.0597 14.9825 16.5269 15.1715 17.0124 15.1675Z"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.0124 22.1674H20.3199C21.3105 22.1955 22.1368 21.4161 22.1667 20.4255V19.2425C22.1368 18.2524 21.3112 17.4732 20.321 17.5007H17.0124C16.0222 17.4732 15.1965 18.2524 15.1667 19.2425V20.4244C15.1959 21.415 16.0217 22.1948 17.0124 22.1674Z"
      stroke={color}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Grid;
