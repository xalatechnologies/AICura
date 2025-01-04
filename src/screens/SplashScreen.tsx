import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useTheme } from '@theme/ThemeContext';
import { StyledAppTitle } from '@components/StyledAppTitle';
import { StyledTagline } from '@components/StyledTagline';

export const SplashScreen = () => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Image
        source={require('@assets/images/playstore.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <StyledAppTitle size="large" />
      <StyledTagline />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
});
