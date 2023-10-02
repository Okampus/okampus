import UserSidePanel from '../../../../_components/layouts/SidePanel/UserSidePanel';
import ApolloSubscribe from '../../../../_components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../_components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../server/ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../utils/apollo/get-from-query';

import UserSideBar from '../../../../_components/layouts/SideBar/UserSideBar';
import { GetUserDocument } from '@okampus/shared/graphql';

import { redirect } from 'next/navigation';
import type { GetUserQuery, GetUserQueryVariables } from '@okampus/shared/graphql';

const SubscribeUserDocument = getSubscriptionFromQuery(GetUserDocument);

type UserLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function UserLayout({ children, params }: UserLayoutProps) {
  const variables = { slug: params.slug };
  const { data, errors } = await getApolloQuery<GetUserQuery, GetUserQueryVariables>({
    query: GetUserDocument,
    variables,
  });

  if (errors) redirect(`/403?message=${JSON.stringify(errors)}`);

  const user = data.user[0];
  return (
    <>
      <ApolloWriteCache values={[[user, GetUserDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeUserDocument} variables={variables} data-superjson />
      <UserSideBar user={user} />
      {children}
      <UserSidePanel user={user} />
    </>
  );
}
