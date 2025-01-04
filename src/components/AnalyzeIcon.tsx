import React from 'react';
import Svg, { Path } from 'react-native-svg';

interface AnalyzeIconProps {
  color?: string;
  size?: number;
}

export const AnalyzeIcon = ({ color = '#fff', size = 24 }: AnalyzeIconProps) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M10.5 21a9.5 9.5 0 1 1 9.5-9.5"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M7 10l3 3 3-3"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M15 21L21 21L18 18"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}; 