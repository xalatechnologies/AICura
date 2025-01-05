import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { useTheme } from '@/theme/ThemeContext';
import { useTranslation } from 'react-i18next';
import { Svg, Path } from 'react-native-svg';
import Animated, { 
  useAnimatedStyle, 
  withTiming,
  interpolate,
  useSharedValue
} from 'react-native-reanimated';

export interface BodyPart {
  id: string;
  name: string;
  commonSymptoms: string[];
}

export interface BodyMapProps {
  selectedPart: BodyPart | null;
  onPartSelect: (partId: string) => void;
  compact?: boolean;
}

export const BodyMap: React.FC<BodyMapProps> = ({
  selectedPart,
  onPartSelect,
  compact,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [showingFront, setShowingFront] = useState(true);
  const rotation = useSharedValue(0);

  const handlePress = (partId: string) => {
    onPartSelect(partId);
  };

  const handleRotate = () => {
    setShowingFront(!showingFront);
    rotation.value = withTiming(showingFront ? 180 : 0, { duration: 500 });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateY: `${rotation.value}deg` },
        { scale: interpolate(rotation.value, [0, 90, 180], [1, 0.8, 1]) }
      ]
    };
  });

  const getHighlightColor = (partId: string) => {
    return selectedPart?.id === partId ? colors.primary : '#FFFFFF';
  };

  const height = compact ? 300 : 400;
  const width = height * 0.6;

  const renderFrontView = () => (
    <Svg width={width} height={height} viewBox="0 0 300 500">
      {/* Head */}
      <Path
        id="head"
        d="M120,40 Q150,40 180,40 Q180,10 150,10 Q120,10 120,40"
        fill={getHighlightColor('head')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('head')}
      />
      
      {/* Neck */}
      <Path
        id="neck"
        d="M135,40 L165,40 L165,60 L135,60 Z"
        fill={getHighlightColor('neck')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('neck')}
      />
      
      {/* Chest */}
      <Path
        id="chest"
        d="M120,60 L180,60 L190,150 L110,150 Z"
        fill={getHighlightColor('chest')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('chest')}
      />
      
      {/* Abdomen */}
      <Path
        id="abdomen"
        d="M110,150 L190,150 L185,220 L115,220 Z"
        fill={getHighlightColor('abdomen')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('abdomen')}
      />
      
      {/* Arms */}
      <Path
        id="left-upper-arm"
        d="M110,60 L90,60 L80,120 L100,120 Z"
        fill={getHighlightColor('left-upper-arm')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('left-upper-arm')}
      />
      <Path
        id="right-upper-arm"
        d="M190,60 L210,60 L220,120 L200,120 Z"
        fill={getHighlightColor('right-upper-arm')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('right-upper-arm')}
      />
      
      {/* Lower Arms */}
      <Path
        id="left-lower-arm"
        d="M80,120 L100,120 L95,180 L75,180 Z"
        fill={getHighlightColor('left-lower-arm')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('left-lower-arm')}
      />
      <Path
        id="right-lower-arm"
        d="M200,120 L220,120 L225,180 L205,180 Z"
        fill={getHighlightColor('right-lower-arm')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('right-lower-arm')}
      />
      
      {/* Legs */}
      <Path
        id="left-upper-leg"
        d="M115,220 L150,220 L145,300 L110,300 Z"
        fill={getHighlightColor('left-upper-leg')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('left-upper-leg')}
      />
      <Path
        id="right-upper-leg"
        d="M150,220 L185,220 L190,300 L155,300 Z"
        fill={getHighlightColor('right-upper-leg')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('right-upper-leg')}
      />
      
      {/* Lower Legs */}
      <Path
        id="left-lower-leg"
        d="M110,300 L145,300 L140,400 L105,400 Z"
        fill={getHighlightColor('left-lower-leg')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('left-lower-leg')}
      />
      <Path
        id="right-lower-leg"
        d="M155,300 L190,300 L195,400 L160,400 Z"
        fill={getHighlightColor('right-lower-leg')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('right-lower-leg')}
      />
    </Svg>
  );

  const renderBackView = () => (
    <Svg width={width} height={height} viewBox="0 0 300 500">
      {/* Back of Head */}
      <Path
        id="head-back"
        d="M120,40 Q150,40 180,40 Q180,10 150,10 Q120,10 120,40"
        fill={getHighlightColor('head-back')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('head-back')}
      />
      
      {/* Back of Neck */}
      <Path
        id="neck-back"
        d="M135,40 L165,40 L165,60 L135,60 Z"
        fill={getHighlightColor('neck-back')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('neck-back')}
      />
      
      {/* Back */}
      <Path
        id="upper-back"
        d="M120,60 L180,60 L190,150 L110,150 Z"
        fill={getHighlightColor('upper-back')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('upper-back')}
      />
      <Path
        id="lower-back"
        d="M110,150 L190,150 L185,220 L115,220 Z"
        fill={getHighlightColor('lower-back')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('lower-back')}
      />
      
      {/* Buttocks */}
      <Path
        id="left-buttock"
        d="M115,220 L150,220 L145,270 L110,270 Z"
        fill={getHighlightColor('left-buttock')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('left-buttock')}
      />
      <Path
        id="right-buttock"
        d="M150,220 L185,220 L190,270 L155,270 Z"
        fill={getHighlightColor('right-buttock')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('right-buttock')}
      />
      
      {/* Back of Legs */}
      <Path
        id="left-upper-leg-back"
        d="M110,270 L145,270 L140,350 L105,350 Z"
        fill={getHighlightColor('left-upper-leg-back')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('left-upper-leg-back')}
      />
      <Path
        id="right-upper-leg-back"
        d="M155,270 L190,270 L195,350 L160,350 Z"
        fill={getHighlightColor('right-upper-leg-back')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('right-upper-leg-back')}
      />
      
      {/* Lower Legs Back */}
      <Path
        id="left-lower-leg-back"
        d="M105,350 L140,350 L135,400 L100,400 Z"
        fill={getHighlightColor('left-lower-leg-back')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('left-lower-leg-back')}
      />
      <Path
        id="right-lower-leg-back"
        d="M160,350 L195,350 L200,400 L165,400 Z"
        fill={getHighlightColor('right-lower-leg-back')}
        stroke="#000000"
        strokeWidth="2"
        onPress={() => handlePress('right-lower-leg-back')}
      />
    </Svg>
  );

  return (
    <View style={[styles.container, { height }]}>
      <Pressable
        style={styles.rotateButton}
        onPress={handleRotate}
      >
        <Text style={[styles.rotateText, { color: colors.text }]}>
          {showingFront ? t('symptoms.bodyMap.frontView') : t('symptoms.bodyMap.backView')}
        </Text>
      </Pressable>
      
      <Animated.View style={[styles.bodyContainer, animatedStyle]}>
        {showingFront ? renderFrontView() : renderBackView()}
      </Animated.View>
      
      {selectedPart && (
        <View style={styles.selectedPartContainer}>
          <Text style={[styles.selectedPartText, { color: colors.text }]}>
            {t(`symptoms.bodyMap.bodyParts.${selectedPart.id}`)}
          </Text>
          <Text style={[styles.symptomsText, { color: colors.textSecondary }]}>
            {t('symptoms.bodyMap.commonSymptoms')}: {selectedPart.commonSymptoms.join(', ')}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  bodyContainer: {
    position: 'relative',
    backfaceVisibility: 'hidden',
  },
  rotateButton: {
    padding: 10,
    marginBottom: 20,
  },
  rotateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedPartContainer: {
    marginTop: 16,
    alignItems: 'center',
    padding: 16,
  },
  selectedPartText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  symptomsText: {
    fontSize: 14,
    textAlign: 'center',
  },
});