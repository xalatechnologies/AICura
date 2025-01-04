import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { BodyPart } from '@hooks/useSymptomAnalysis';
import Svg, { Path, Circle, G } from 'react-native-svg';

interface BodyMapProps {
  bodyParts: BodyPart[];
  selectedPart: BodyPart | null;
  onSelectPart: (partId: string) => void;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  bodyParts,
  selectedPart,
  onSelectPart,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Svg
          viewBox="0 0 100 180"
          style={styles.bodyImage}
        >
          {/* Base Body Shape - simplified human figure */}
          <G fill={colors.card} stroke={colors.border} strokeWidth="0.5">
            {/* Head */}
            <Circle cx="50" cy="20" r="10" />
            <Path d="M45 25 Q50 30 55 25" />
            
            {/* Neck */}
            <Path d="M45 30 L55 30 L53 35 L47 35 Z" />
            
            {/* Torso */}
            <Path d="M40 35 L60 35 L65 90 L35 90 Z" />
            
            {/* Arms */}
            <Path d="M38 35 L25 60 L20 90 L25 90 L30 65 L38 45" />
            <Path d="M62 35 L75 60 L80 90 L75 90 L70 65 L62 45" />
            
            {/* Legs */}
            <Path d="M35 90 L30 140 L35 170 L45 170 L40 140 L42 90" />
            <Path d="M65 90 L70 140 L65 170 L55 170 L60 140 L58 90" />
          </G>

          {/* Interactive Regions */}
          {bodyParts.map((part) => (
            <Circle
              key={part.id}
              cx={`${part.coordinates?.x}`}
              cy={`${part.coordinates?.y}`}
              r={`${part.coordinates?.radius}`}
              fill={selectedPart?.id === part.id ? colors.primary : 'transparent'}
              opacity={selectedPart?.id === part.id ? 0.3 : 0}
              onPress={() => onSelectPart(part.id)}
            />
          ))}
        </Svg>
      </View>

      <View style={styles.partsList}>
        {bodyParts.map((part) => (
          <TouchableOpacity
            key={part.id}
            style={[
              styles.partButton,
              {
                backgroundColor:
                  selectedPart?.id === part.id ? colors.primary : colors.card,
              },
            ]}
            onPress={() => onSelectPart(part.id)}
          >
            <Text
              style={[
                styles.partText,
                {
                  color:
                    selectedPart?.id === part.id ? '#FFFFFF' : colors.text,
                },
              ]}
            >
              {part.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  mapContainer: {
    width: '100%',
    aspectRatio: 0.6,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bodyImage: {
    width: '100%',
    height: '100%',
  },
  partsList: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 20,
  },
  partButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
  },
  partText: {
    fontSize: 14,
    fontWeight: '500',
  },
}); 