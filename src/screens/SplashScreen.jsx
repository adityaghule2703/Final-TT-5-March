import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // navigation.replace('Home');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const onVideoEnd = () => {
    // navigation.replace('Home');
  };

  const onVideoError = (error) => {
    console.log('Video Error: ', error);
    // navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <Video
        ref={videoRef}
        source={require('../../assets/splash-tt.mp4')}
        style={styles.video}
        resizeMode="cover"
        onEnd={onVideoEnd}
        onError={onVideoError}
        paused={false}
        repeat={false}
        muted={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: width,
    height: height,
  },
});

export default SplashScreen;