import ApolloSubscribe from '../../../../_components/wrappers/ApolloSubscribe';
import ApolloWriteCache from '../../../../_components/wrappers/ApolloWriteCache';

import { getApolloQuery } from '../../../../../server/ssr/getApolloQuery';
import { getSubscriptionFromQuery } from '../../../../../utils/apollo/get-from-query';

import { GetEventDocument } from '@okampus/shared/graphql';

import { redirect } from 'next/navigation';

import type { GetEventQuery, GetEventQueryVariables } from '@okampus/shared/graphql';

const SubscribeEventDocument = getSubscriptionFromQuery(GetEventDocument);

type EventLayoutProps = { children: React.ReactNode; params: { slug: string } };
export default async function EventLayout({ children, params }: EventLayoutProps) {
  const variables = { slug: params.slug };
  const { data, errors } = await getApolloQuery<GetEventQuery, GetEventQueryVariables>({
    query: GetEventDocument,
    variables,
  });

  if (errors) redirect(`/403?message=${JSON.stringify(errors)}`);

  const event = data.event[0];

  return (
    <>
      <ApolloWriteCache values={[[event, GetEventDocument]]} data-superjson />
      <ApolloSubscribe fragment={SubscribeEventDocument} variables={variables} data-superjson />
      {children}
    </>
  );
}
