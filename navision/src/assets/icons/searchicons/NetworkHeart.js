import React from 'react';
import Svg, { Path } from 'react-native-svg';

const NetworkHeart = ({ width = 24, height = 24, color = 'black' }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M1.89697 17.5L9.49997 17.501"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.51001 5.5H21.495"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M10.5 11.501L0.509033 11.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.3771 23.484C5.31177 23.1494 0.552725 18.1552 0.510777 12.0809C0.46883 6.0065 5.15845 0.94709 11.2185 0.528762C17.2786 0.110435 22.619 4.47748 23.4121 10.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.2681 0.526001C5.26814 7.026 5.37714 15.484 11.3771 23.484"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.729 0.526001C15.3386 3.22168 16.9063 6.75626 17.153 10.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M17.5001 23.5L12.3861 18.165C11.4652 17.2444 11.2368 15.8377 11.8191 14.673V14.673C12.2542 13.8032 13.0809 13.1955 14.041 13.0398C15.001 12.884 15.9774 13.1993 16.6651 13.887L17.5001 14.722L18.3351 13.887C19.0229 13.1993 19.9993 12.884 20.9593 13.0398C21.9193 13.1955 22.746 13.8032 23.1811 14.673V14.673C23.7634 15.8377 23.535 17.2444 22.6141 18.165L17.5001 23.5Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default NetworkHeart;
