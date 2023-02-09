import { customFontsToLoad } from '../constants/theme/typography';

import { useEffect, useState } from 'react';
import Font from 'expo-font';
import SplashScreen from 'expo-splash-screen';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync({
          ...MaterialCommunityIcons.font,
          ...Ionicons.font,
          ...customFontsToLoad,
        });
      } catch (error) {
        // We might want to provide this error information to an error reporting service
        console.warn(error);
      } finally {
        setLoadingComplete(true);
        SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}
