import React from 'react';
import Svg, { Rect, Path } from 'react-native-svg';

const SearchAI = ({ width = 31, height = 32, color = 'black' }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 31 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Rect
        x="1.16047"
        y="5.0287"
        width="27.8513"
        height="25.5303"
        rx="8.12329"
        stroke={color}
        strokeWidth="2.32094"
      />
      <Rect
        x="8.89708"
        y="0.386823"
        width="2.32094"
        height="9.28376"
        rx="1.16047"
        fill={color}
        stroke={color}
        strokeWidth="0.773646"
      />
      <Rect
        x="18.1808"
        y="0.386823"
        width="2.32094"
        height="9.28376"
        rx="1.16047"
        fill={color}
        stroke={color}
        strokeWidth="0.773646"
      />
      <Path
        d="M16.1366 22.9646L15.0948 20.2934H10.7674L9.72566 22.9379L8.64382 22.4971L12.3034 13.4817H13.6924L17.2986 22.4971L16.1366 22.9646ZM11.1681 19.2249H14.6808L12.9311 14.7372L11.1681 19.2249ZM18.6338 22.831V13.4817H19.9026V22.831H18.6338Z"
        fill={color}
      />
    </Svg>
  );
};

export default SearchAI;
