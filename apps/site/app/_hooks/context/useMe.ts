'use client';

import { jsonFetcher } from '../../../utils/json-fetcher';
import { redirect } from 'next/navigation';
import useSWR from 'swr';

import type { UserMe } from '../../../types/prisma/User/user-me';

export function useMe() {
  const { data, error, isLoading, isValidating, mutate } = useSWR<UserMe>('/api/me', () => jsonFetcher(`/api/me`));
  if (!data) redirect('/signin');
  return { data, error, isLoading, isValidating, mutate };
}
