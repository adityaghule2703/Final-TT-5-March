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
    }, 6000);

    return () => clearTimeout(timer);
  }, [navigation]);

  const onVideoEnd = () => {
    // navigation.replace('Home');
  };

  const onVideoError = (error) => {
    console.log('Video Error: ', error);
    // navigation.replace('Home');
  };

  const onVideoLoad = () => {
    console.log('Video loaded successfully');
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      {/* Video component */}
      <Video
        ref={videoRef}
        source={require('../../assets/houzie_timez_splash.mp4')}
        style={styles.video}
        resizeMode="cover"
        onEnd={onVideoEnd}
        onError={onVideoError}
        onLoad={onVideoLoad}
        volume={0.7}
        paused={false}
        repeat={false}
        muted={true} // Keep video muted
        controls={false}
        disableFocus={true}
        playInBackground={false}
        playWhenInactive={false}
        ignoreSilentSwitch="ignore"
        bufferConfig={{
          minBufferMs: 15000,
          maxBufferMs: 50000,
          bufferForPlaybackMs: 2500,
          bufferForPlaybackAfterRebufferMs: 5000
        }}
        posterResizeMode="cover"
      />
      
      {/* Audio component - plays background music */}
      <Video
        source={require('../../assets/houzie-song.mp3')} // Your audio file
        paused={false}
        repeat={false} // Set to true if you want music to loop
        muted={false}
        volume={0.05} // Adjust volume (0.0 to 1.0)
        audioOnly={true} // This makes it an audio-only player
        playInBackground={true} // Allow audio to play in background
        playWhenInactive={true}
        ignoreSilentSwitch="ignore"
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