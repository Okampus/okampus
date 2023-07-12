import { EVENT_MANAGE_SLUG_PARAM } from '@okampus/shared/consts';
import { eventManageDetailsInfo, formBaseInfo, useTypedLazyQuery } from '@okampus/shared/graphql';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useEventManage() {
  const eventSlug = useParams()[EVENT_MANAGE_SLUG_PARAM];
  const [getEvent, { data, error }] = useTypedLazyQuery({
    event: [
      { where: { slug: { _eq: eventSlug } }, limit: 1 },
      {
        ...eventManageDetailsInfo,
        form: formBaseInfo,
        teamEvents: [{}, { teamId: true }],
      },
    ],
  });

  useEffect(() => {
    eventSlug && getEvent();
  }, [eventSlug, useParams]);

  if (!eventSlug || error) return { eventManage: undefined, error: 404 }; // TODO: standardize error codes
  return { eventManage: data?.event?.[0], error: undefined };
}
