import React from 'react';
import Svg, { Path } from 'react-native-svg';

const MusicLoop = ({ width = 17, height = 17, color = "white" }) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 17 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.33536 13.4583C3.50067 13.4404 2.83337 12.7586 2.83337 11.9237C2.83337 11.0888 3.50067 10.407 4.33536 10.3891C5.17005 10.407 5.83735 11.0888 5.83735 11.9237C5.83735 12.7586 5.17005 13.4404 4.33536 13.4583V13.4583Z"
      stroke={color}
      strokeWidth="1.0625"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.6469 12.5828C12.0237 12.5926 11.4565 12.2247 11.2115 11.6517C10.9664 11.0787 11.0921 10.4144 11.5296 9.97055C11.9671 9.52671 12.6295 9.39143 13.2059 9.62821C13.7824 9.86498 14.1585 10.4268 14.1577 11.05C14.1632 11.8903 13.4871 12.5762 12.6469 12.5828V12.5828Z"
      stroke={color}
      strokeWidth="1.0625"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M5.31423 11.9234C5.31423 12.2168 5.55208 12.4546 5.84548 12.4546C6.13888 12.4546 6.37673 12.2168 6.37673 11.9234H5.31423ZM6.37673 6.02083C6.37673 5.72743 6.13888 5.48958 5.84548 5.48958C5.55208 5.48958 5.31423 5.72743 5.31423 6.02083H6.37673ZM5.31421 6.02085C5.31421 6.31425 5.55206 6.5521 5.84546 6.5521C6.13886 6.5521 6.37671 6.31425 6.37671 6.02085H5.31421ZM13.6265 6.02085C13.6265 6.31425 13.8643 6.5521 14.1578 6.5521C14.4512 6.5521 14.689 6.31425 14.689 6.02085H13.6265ZM5.84548 5.48958C5.55208 5.48958 5.31423 5.72743 5.31423 6.02083C5.31423 6.31423 5.55208 6.55208 5.84548 6.55208V5.48958ZM14.1578 6.55208C14.4512 6.55208 14.689 6.31423 14.689 6.02083C14.689 5.72743 14.4512 5.48958 14.1578 5.48958V6.55208ZM14.689 6.02083C14.689 5.72743 14.4512 5.48958 14.1578 5.48958C13.8644 5.48958 13.6265 5.72743 13.6265 6.02083H14.689ZM13.6265 11.05C13.6265 11.3434 13.8644 11.5813 14.1578 11.5813C14.4512 11.5813 14.689 11.3434 14.689 11.05H13.6265ZM6.37673 11.9234V6.02083H5.31423V11.9234H6.37673ZM6.37671 6.02085V4.95835H5.31421V6.02085H6.37671ZM6.37671 4.95835C6.37671 4.46935 6.77312 4.07294 7.26213 4.07294V3.01044C6.18632 3.01044 5.31421 3.88255 5.31421 4.95835H6.37671ZM7.26213 4.07294H12.7411V3.01044H7.26213V4.07294ZM12.7411 4.07294C13.2301 4.07294 13.6265 4.46935 13.6265 4.95835H14.689C14.689 3.88255 13.8169 3.01044 12.7411 3.01044V4.07294ZM13.6265 4.95835V6.02085H14.689V4.95835H13.6265ZM5.84548 6.55208H14.1578V5.48958H5.84548V6.55208ZM13.6265 6.02083V11.05H14.689V6.02083H13.6265Z"
      fill={color}
    />
  </Svg>
);

export default MusicLoop;