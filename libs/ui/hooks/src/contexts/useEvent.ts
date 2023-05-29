import { EVENT_SLUG_PARAM } from '@okampus/shared/consts';
import { eventDetailsInfo, useTypedLazyQuery } from '@okampus/shared/graphql';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function useEvent() {
  const eventSlug = useParams()[EVENT_SLUG_PARAM];
  const [getEvent, { data, error }] = useTypedLazyQuery({
    event: [{ where: { contentMaster: { slug: { _eq: eventSlug } } }, limit: 1 }, eventDetailsInfo],
  });

  useEffect(() => {
    eventSlug && getEvent();
  }, [eventSlug, useParams]);

  if (!eventSlug || error) return { event: undefined, error: 404 }; // TODO: standardize error codes
  return { event: data?.event?.[0], error: undefined };
}
