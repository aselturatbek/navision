import React from 'react';
import { Svg, Path } from 'react-native-svg';

const GridIcon = ({ color = "#848181" }) => { // Default color
  return (
    <Svg width="24" height="60" viewBox="0 0 22 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.34221 10.1674H3.32454C2.73502 10.1625 2.16771 10.392 1.7474 10.8054C1.3271 11.2188 1.08824 11.7823 1.08337 12.3718V20.7145C1.09428 21.9416 2.09748 22.9277 3.32454 22.9174H7.34221C7.93172 22.9223 8.49904 22.6928 8.91935 22.2795C9.33965 21.8661 9.57851 21.3026 9.58337 20.7131V12.3718C9.57851 11.7823 9.33965 11.2188 8.91935 10.8054C8.49904 10.392 7.93172 10.1625 7.34221 10.1674Z"
        stroke={color} // Use the passed color
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.34221 1.66754H3.32454C2.12215 1.63419 1.11962 2.58032 1.08337 3.78263V5.21913C1.11962 6.42143 2.12215 7.36756 3.32454 7.33421H7.34221C8.54459 7.36756 9.54713 6.42143 9.58337 5.21913V3.78263C9.54713 2.58032 8.54459 1.63419 7.34221 1.66754Z"
        stroke={color} // Use the passed color
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.6579 14.4176H18.6742C19.2639 14.4229 19.8316 14.1936 20.2522 13.7801C20.6728 13.3667 20.9119 12.803 20.9167 12.2133V3.87195C20.9119 3.28244 20.673 2.719 20.2527 2.3056C19.8324 1.8922 19.2651 1.66271 18.6756 1.66762H14.6579C14.0684 1.66271 13.5011 1.8922 13.0808 2.3056C12.6605 2.719 12.4216 3.28244 12.4167 3.87195V12.2133C12.4216 12.8028 12.6605 13.3662 13.0808 13.7796C13.5011 14.193 14.0684 14.4225 14.6579 14.4176Z"
        stroke={color} // Use the passed color
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.6579 22.9175H18.6742C19.8771 22.9517 20.8805 22.0053 20.9167 20.8024V19.3659C20.8805 18.1636 19.878 17.2175 18.6756 17.2509H14.6579C13.4555 17.2175 12.453 18.1636 12.4167 19.3659V20.801C12.4522 22.0039 13.455 22.9509 14.6579 22.9175Z"
        stroke={color} // Use the passed color
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default GridIcon;
