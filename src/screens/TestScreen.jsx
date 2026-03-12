// App.jsx - WITH EXPLICIT DIMENSIONS
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  console.log('App with dimensions');
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>WORKING!</Text>
        <Text style={styles.subText}>Width: {width}, Height: {height}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  text: {
    color: 'blue',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: 'black',
    fontSize: 16,
    marginTop: 10,
  },
});