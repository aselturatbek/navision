import React from 'react';
import Svg, { Rect, Defs, Pattern, Use, Image } from 'react-native-svg';

const NavisionIcon = () => {
  return (
    <Svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Defs>
        <Pattern id="pattern0_669_610" patternContentUnits="objectBoundingBox" width="1" height="1">
          <Use href="#image0_669_610" transform="scale(0.00166113)" />
        </Pattern>
        <Image
          id="image0_669_610"
          width="602"
          height="602"
          href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."
        />
      </Defs>
      <Rect width="12" height="12" rx="2" fill="url(#pattern0_669_610)" />
    </Svg>
  );
};

export default NavisionIcon;
