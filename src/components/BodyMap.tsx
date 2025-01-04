import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { BodyPart } from '@hooks/useSymptomAnalysis';
import Svg, { Path, Circle, G } from 'react-native-svg';

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
  compact = true,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      <View style={[styles.mapContainer, compact && styles.mapContainerCompact]}>
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

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={[styles.partsListContainer, compact && styles.partsListContainerCompact]}
      >
        <View style={[styles.partsList, { marginTop: compact ? 0 : 20 }]}>
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
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    padding: 20,
  },
  containerCompact: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  mapContainerCompact: {
    width: '40%',
    minWidth: 120,
    maxWidth: 160,
  },
  bodyImage: {
    width: '100%',
    height: '100%',
  },
  partsListContainer: {
    flexGrow: 0,
  },
  partsListContainerCompact: {
    flex: 1,
  },
  partsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  partButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  partText: {
    fontSize: 13,
    fontWeight: '500',
  },
}); 