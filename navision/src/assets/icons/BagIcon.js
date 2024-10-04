import React from 'react';
import { Svg, Path } from 'react-native-svg';

const BagIcon = ({color = "#848181"}) => {
  return (
    <Svg width="34" height="34" viewBox="0 0 36 36" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.50053 13.95C7.4805 12.4798 8.65536 11.2714 10.1255 11.25H25.8755C27.3457 11.2714 28.5206 12.4798 28.5005 13.95V26.1C28.5414 29.0407 26.1912 31.458 23.2505 31.5H12.7505C9.80984 31.458 7.45964 29.0407 7.50053 26.1V13.95Z"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M23.2505 15.3V9.9C23.2914 6.9593 20.9412 4.54195 18.0005 4.5C15.0598 4.54195 12.7096 6.9593 12.7505 9.9V15.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default BagIcon;
