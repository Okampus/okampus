import Navigation from './app/components/navigation';
import useCachedResources from './app/hooks/useCachedResources';
import useColorScheme from './app/hooks/useColorScheme';
import { client } from './app/providers/apollo';
import { emitter } from './app/providers/mitt';
import { useMutation } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { getFragmentData, loginMutation, meFragment } from '@okampus/shared/graphql';
import type { MyInfoFragment } from '@okampus/shared/graphql';

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  const [firstRun, setFirstRun] = useState(true);
  const [currentUser, setCurrentUser] = useState<MyInfoFragment | null>(null);
  const [mutateFunction, { data, loading, error }] = useMutation(loginMutation, { client });

  if (!isLoadingComplete) return null;

  if (firstRun) {
    const onLogout = () => {
      setCurrentUser(null);
    };

    emitter.on('logout', onLogout);

    mutateFunction({
      variables: { username: 'okampus-admin', password: 'root' },
      onCompleted: (data) => {
        setCurrentUser(getFragmentData(meFragment, data.login.user));
      },
    });
    setFirstRun(false);
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{JSON.stringify(error)}</Text>
      </View>
    );
  }

  if (loading) return null;

  if (!data) return null;

  if (!currentUser) return null;

  return (
    <SafeAreaProvider>
      <Navigation colorScheme={colorScheme} />
      <StatusBar />
    </SafeAreaProvider>
  );
}
