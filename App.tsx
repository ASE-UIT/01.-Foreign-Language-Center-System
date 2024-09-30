import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './App/Navigation/AppNavigator';
// import libs to use fonts
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';




SplashScreen.preventAutoHideAsync(); // waiting to load fonts

export default function App() {
  // add fonts in root layout - start
  const [loaded, error] = useFonts({
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'GowunBatang': require('./assets/fonts/GowunBatang.ttf'),
  });
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
//-end

  return (
    <>
      <StatusBar style="light" />
      <AppNavigator />
    </>
  );
}
