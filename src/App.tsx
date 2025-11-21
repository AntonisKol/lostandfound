import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Header from '../components/Header';
import LandingScreen from './components/ LandingScreen/ LandingScreen';
 
export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Header   />      <LandingScreen />

     </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
