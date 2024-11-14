import React from "react";
import Svg, { G, Path, Defs, Filter, FeFlood, FeColorMatrix, FeOffset, FeGaussianBlur, FeComposite, FeBlend } from "react-native-svg";

const LoopExplore = ({ width = 38, height = 23 }) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 38 23"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G filter="url(#filter0_d_670_884)">
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.9746 2.05452C13.2353 -0.68484 8.79388 -0.68484 6.05452 2.05452C3.31516 4.79388 3.31516 9.23526 6.05452 11.9746C8.79388 14.714 13.2353 14.714 15.9746 11.9746L19.957 7.99225L20.9347 7.01457L19.957 6.03689L15.9746 2.05452ZM8.00987 4.00987C9.66932 2.35043 12.3598 2.35043 14.0193 4.00987L17.024 7.01457L14.0193 10.0193C12.3598 11.6787 9.66932 11.6787 8.00987 10.0193C6.35043 8.35982 6.35043 5.66932 8.00987 4.00987ZM20.4937 7.19524C20.6396 7.11201 20.6396 6.90171 20.4937 6.81848L17.8544 5.31256C17.7098 5.23007 17.53 5.33448 17.53 5.50094V8.51277C17.53 8.67923 17.7098 8.78364 17.8544 8.70115L20.4937 7.19524Z"
          fill="white"
        />
        <Path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M21.9535 12.0109C24.6928 14.7502 29.1342 14.7502 31.8736 12.0109C34.6129 9.2715 34.6129 4.83012 31.8736 2.09076C29.1342 -0.6486 24.6928 -0.6486 21.9535 2.09076L18.413 5.6312L20.4939 6.81847C20.6398 6.9017 20.6398 7.11201 20.4939 7.19523L18.357 8.41444L21.9535 12.0109ZM17.5302 7.58758L17.5302 6.51404L16.9934 7.05081L17.5302 7.58758ZM29.9182 10.0555C28.2588 11.715 25.5683 11.715 23.9088 10.0555L20.9041 7.05081L23.9088 4.04611C25.5683 2.38667 28.2588 2.38667 29.9182 4.04611C31.5777 5.70556 31.5777 8.39606 29.9182 10.0555Z"
          fill="white"
        />
      </G>
      <Defs>
        <Filter
          id="filter0_d_670_884"
          x="0"
          y="0"
          width="37.928"
          height="22.0654"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <FeFlood floodOpacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="4" />
          <FeGaussianBlur stdDeviation="2" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <FeBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_670_884" />
          <FeBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_670_884" result="shape" />
        </Filter>
      </Defs>
    </Svg>
  );
};

export default LoopExplore;
