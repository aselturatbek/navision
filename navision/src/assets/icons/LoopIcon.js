import React from 'react';
import Svg, { Path } from 'react-native-svg';

const LoopIcon = (props) => (
  <Svg
    width={33}
    height={17}
    viewBox="0 0 33 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M4.12906 4.129C6.40944 1.84862 10.1067 1.84861 12.3871 4.129L16.5161 8.258L12.3871 12.387C10.1067 14.6674 6.40944 14.6674 4.12906 12.387V12.387C1.84868 10.1066 1.84868 6.40938 4.12906 4.129V4.129Z"
      stroke="white"
      strokeWidth="2.73214"
    />
    <Path
      d="M28.8709 12.4246C26.5906 14.705 22.8933 14.705 20.6129 12.4246L16.4839 8.29559L20.6129 4.1666C22.8933 1.88621 26.5906 1.88621 28.8709 4.16659V4.16659C31.1513 6.44698 31.1513 10.1442 28.8709 12.4246V12.4246Z"
      stroke="white"
      strokeWidth="2.73214"
    />
  </Svg>
);

export default LoopIcon;
