'use client';

import ApolloSubscribe from './ApolloSubscribe';
import ApolloWriteCache from './ApolloWriteCache';

import { apolloClient } from '../../context/apollo';
import { meSlugAtom } from '../../context/global';
import { userLoginInfo } from '@okampus/shared/graphql';
import { ApolloProvider } from '@apollo/client';

import { useAtom } from 'jotai';
import type { UserLoginInfo } from '@okampus/shared/graphql';

export type ApolloJotaiInitializeMeProps = {
  me: UserLoginInfo;
  children: React.ReactNode;
};
export default function ApolloInitializeMe({ me, children }: ApolloJotaiInitializeMeProps) {
  const [, setMeSlug] = useAtom(meSlugAtom);
  setMeSlug(me.user.individual.actor.slug);

  return (
    <ApolloProvider client={apolloClient}>
      <ApolloWriteCache values={[[me, userLoginInfo]]} />
      <ApolloSubscribe selector={{ userByPk: [{ id: me.user.id }, userLoginInfo.user] }} />
      {children}
    </ApolloProvider>
  );
}
