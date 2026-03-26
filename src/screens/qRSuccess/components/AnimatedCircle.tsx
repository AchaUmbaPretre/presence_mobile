import React from 'react';
import Svg, { Circle, Defs, Stop, LinearGradient as SvgGradient } from 'react-native-svg';

interface AnimatedCircleProps {
  gradientColors: string[];
  primaryColor: string;
}

export const AnimatedCircle: React.FC<AnimatedCircleProps> = ({
  gradientColors,
  primaryColor,
}) => {
  return (
    <Svg width={140} height={140} viewBox="0 0 140 140">
      <Defs>
        <SvgGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="0.1" />
        </SvgGradient>
      </Defs>
      <Circle
        cx="70"
        cy="70"
        r="65"
        stroke={`${primaryColor}20`}
        strokeWidth="2"
        fill="none"
      />
      <Circle
        cx="70"
        cy="70"
        r="65"
        stroke={primaryColor}
        strokeWidth="3"
        strokeDasharray="8 5"
        fill="none"
        opacity="0.5"
      />
    </Svg>
  );
};