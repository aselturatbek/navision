import React from "react";
import Svg, { Path } from "react-native-svg";

const Star = ({ width = 22, height = 22, color = "black" }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4654 6.35332L11.0001 1.66666L8.53475 6.35332C8.36058 6.69581 8.1085 6.99265 7.79875 7.21999C7.48749 7.44849 7.12732 7.60142 6.74675 7.66666L1.66675 8.66266L5.21341 12.904C5.69844 13.4356 5.92731 14.1524 5.84008 14.8667L5.16541 20.3333L9.84275 18.0667C10.2036 17.8919 10.5992 17.8007 11.0001 17.8C11.3762 17.8011 11.7466 17.8926 12.0801 18.0667L16.8667 20.1933L16.1921 14.792C16.1068 14.0793 16.3361 13.3647 16.8201 12.8347L20.3334 8.66266L15.2534 7.66666C14.8724 7.60162 14.5117 7.44868 14.2001 7.21999C13.8908 6.99249 13.6392 6.69566 13.4654 6.35332Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default Star;
