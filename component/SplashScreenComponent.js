import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';

const SplashScreenComponent = ({onSplashEnd}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      // Signal that the splash screen should be hidden
      onSplashEnd();
    }, 3500); // 3 seconds

    // Cleanup function to clear the timeout in case component unmounts
    return () => clearTimeout(timeout);
  }, [onSplashEnd]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash.gif')} // Replace with your GIF file path
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FBFBFB',
  },
  image: {
    resizeMode: 'contain',
    width: '80%',
    height: '80%',
  },
});

export default SplashScreenComponent;
