import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { BodyPart } from '../types';
import Svg, { Path, Circle } from 'react-native-svg';

interface BodyMapProps {
  bodyParts: BodyPart[];
  selectedPart: BodyPart | null;
  onSelectPart: (partId: string) => void;
  compact?: boolean;
}

export const BodyMap: React.FC<BodyMapProps> = ({ 
  bodyParts,
  selectedPart,
  onSelectPart,
  compact 
}) => {
  const { colors } = useTheme();
  const height = compact ? 300 : 400;
  const width = height * 0.6;

  return (
    <View style={[styles.container, { height }]}>
      <Svg width={width} height={height} viewBox="0 0 200 400">
        {/* Head */}
        <Circle
          cx="100"
          cy="40"
          r="30"
          fill="none"
          stroke={colors.text}
          strokeWidth="2"
          onPress={() => onSelectPart('head')}
        />
        {/* Neck */}
        <Path
          d="M85 70 L85 90 L115 90 L115 70"
          fill="none"
          stroke={colors.text}
          strokeWidth="2"
          onPress={() => onSelectPart('neck')}
        />
        {/* Torso */}
        <Path
          d="M85 90 L85 220 L115 220 L115 90"
          fill="none"
          stroke={colors.text}
          strokeWidth="2"
          onPress={() => onSelectPart('torso')}
        />
        {/* Arms */}
        <Path
          d="M85 100 L45 160 M115 100 L155 160"
          fill="none"
          stroke={colors.text}
          strokeWidth="2"
          onPress={() => onSelectPart('arms')}
        />
        {/* Legs */}
        <Path
          d="M85 220 L65 350 M115 220 L135 350"
          fill="none"
          stroke={colors.text}
          strokeWidth="2"
          onPress={() => onSelectPart('legs')}
        />
        {/* Selected part highlight */}
        {selectedPart && (
          <Circle
            cx={selectedPart.coordinates?.x || 0}
            cy={selectedPart.coordinates?.y || 0}
            r={selectedPart.coordinates?.radius || 20}
            fill={colors.primary}
            opacity={0.3}
          />
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  }
}); 