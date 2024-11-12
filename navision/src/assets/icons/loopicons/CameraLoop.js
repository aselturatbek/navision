import React from 'react';
import Svg, { Path } from 'react-native-svg';

const CameraLoop = ({ width = 40, height = 40, color = "white" }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 40 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.33337 17V24.2217C8.34043 25.7616 8.95903 27.2355 10.053 28.3192C11.1471 29.4029 12.6268 30.0075 14.1667 30H25.8334C27.3732 30.0075 28.853 29.4029 29.947 28.3192C31.0411 27.2355 31.6597 25.7616 31.6667 24.2217V17C31.6597 15.4601 31.0411 13.9862 29.947 12.9025C28.853 11.8188 27.3732 11.2141 25.8334 11.2217C25.0246 11.1144 24.3336 10.5858 24.0184 9.83335C23.5016 8.90475 22.5211 8.33024 21.4584 8.33335H18.5417C17.479 8.33024 16.4985 8.90475 15.9817 9.83335C15.6665 10.5858 14.9755 11.1144 14.1667 11.2217C12.6268 11.2141 11.1471 11.8188 10.053 12.9025C8.95903 13.9862 8.34043 15.4601 8.33337 17Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20 24.2217C18.0098 24.2024 16.4103 22.5766 16.4234 20.5863C16.4366 18.5961 18.0574 16.9916 20.0477 16.9985C22.038 17.0055 23.6475 18.6214 23.6467 20.6117C23.6418 21.574 23.2549 22.4949 22.571 23.1719C21.8871 23.849 20.9623 24.2266 20 24.2217Z"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default CameraLoop;
