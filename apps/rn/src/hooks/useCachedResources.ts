import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons'
import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'

import { customFontsToLoad } from '../../src/constants/theme/typography'

export default function useCachedResources() {
    const [isLoadingComplete, setLoadingComplete] = useState(false)

    // Load any resources or data that we need prior to rendering the app
    useEffect(() => {
        async function loadResourcesAndDataAsync() {
            try {
                SplashScreen.preventAutoHideAsync()

                // Load fonts
                await Font.loadAsync({
                    ...MaterialCommunityIcons.font,
                    ...Ionicons.font,
                    ...customFontsToLoad,
                })
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e)
            } finally {
                setLoadingComplete(true)
                SplashScreen.hideAsync()
            }
        }

        loadResourcesAndDataAsync()
    }, [])

    return isLoadingComplete
}
