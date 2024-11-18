import React from 'react';
import Svg, { Path } from 'react-native-svg';

const MentionIcon = ({ color = 'black', size = 35 }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.0763 17.5001C21.1153 19.7145 19.3532 21.5419 17.1388 21.5834C14.9239 21.5427 13.1608 19.715 13.1999 17.5001C13.1608 15.2857 14.923 13.4582 17.1374 13.4167C19.3523 13.4574 21.1153 15.2851 21.0763 17.5001Z"
        stroke={color}
        strokeWidth="2.1875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M25.9996 21.4127C25.1711 23.5402 23.643 25.3223 21.6669 26.4659C19.7325 27.5774 17.4639 27.9592 15.2721 27.5421C13.0613 27.1092 11.0724 25.9145 9.65173 24.1661C6.66016 20.468 6.49682 15.2304 9.25215 11.3532C10.5601 9.51155 12.4693 8.1836 14.6509 7.59795C16.8068 7.03067 19.0947 7.25631 21.0982 8.23379C23.1409 9.23919 24.7775 10.9139 25.7357 12.9792L25.8042 13.125C26.8455 15.5007 26.0551 19.5417 23.538 19.5417C22.1486 19.5106 21.047 18.3601 21.0763 16.9707"
        stroke={color}
        strokeWidth="2.1875"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MentionIcon;
