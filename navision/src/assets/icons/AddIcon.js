import React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const AddIcon = ({ color = "black" }) => (
  <Svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <Circle cx="29.8571" cy="29.9963" r="28.9963" stroke={color} strokeWidth="1.5" style={{ mixBlendMode: "overlay" }} />
    <Circle cx="29.8571" cy="29.9963" r="28.9963" stroke={color} strokeWidth="1.5" />
    <Path d="M42.3857 30.3797H18.0953" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M29.7953 17.7893V42.0797" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default AddIcon;
