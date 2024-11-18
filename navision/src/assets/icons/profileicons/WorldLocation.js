import React from 'react';
import Svg, { Path } from 'react-native-svg';

const WorldLocation = ({ color = 'black', size = 24 }) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        d="M2.00104 17.516H12.117"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.61499 5.51599H21.599"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.603 11.516H0.614014"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.481 23.5C5.48024 23.1687 0.746531 18.2727 0.617619 12.2642C0.488707 6.25566 5.00807 1.16112 10.9891 0.572737C16.9701 -0.0156492 22.3956 4.10056 23.44 10.019"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M11.372 0.541992C5.37202 7.04199 5.48102 15.5 11.481 23.5"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.833 0.541992C15.0732 2.87504 16.56 5.82794 17.1 9.01699"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.5 16.795C19.3284 16.795 20 16.1234 20 15.295C20 14.4666 19.3284 13.795 18.5 13.795C17.6716 13.795 17 14.4666 17 15.295C17 16.1234 17.6716 16.795 18.5 16.795Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 15.3C23 18.3 18.5 22.8 18.5 22.8C18.5 22.8 14 18.3 14 15.3C14 12.8147 16.0147 10.8 18.5 10.8C20.9853 10.8 23 12.8147 23 15.3V15.3Z"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default WorldLocation;
