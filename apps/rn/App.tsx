import { useMutation } from '@apollo/client'
import { StatusBar } from 'expo-status-bar'
import { useState } from 'react'
import { Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { inspect } from 'util'

import Navigation from './src/components/navigation'
import { login } from './src/graphql/mutations/login'
import useCachedResources from './src/hooks/useCachedResources'
import useColorScheme from './src/hooks/useColorScheme'
import { client } from './src/shared/modules/apollo'
import { emitter } from './src/shared/modules/mitt'

export default function App() {
    const isLoadingComplete = useCachedResources()
    const colorScheme = useColorScheme()

    const [firstRun, setFirstRun] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)
    const [mutateFunction, { data, loading, error }] = useMutation(login, {
        client,
        onError: () => {},
    })

    if (!isLoadingComplete) return null

    if (firstRun) {
        const onLogout = () => {
            setCurrentUser(null)
        }

        emitter.on('logout', onLogout)

        mutateFunction({
            variables: { username: 'okampus-admin', password: 'root' },
            onCompleted: (data) => {
                setCurrentUser(data.login)
            },
        })
        setFirstRun(false)
    }

    if (error) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{inspect(error, true, 4, true)}</Text>
            </View>
        )
    }

    if (loading) return null

    if (!data) return null

    if (!currentUser) return null

    return (
        <SafeAreaProvider>
            <Navigation colorScheme={colorScheme} />
            <StatusBar />
        </SafeAreaProvider>
    )
}
