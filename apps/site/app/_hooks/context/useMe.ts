'use client';

import { redirect } from 'next/navigation';
import useSWR from 'swr';

import type { UserMe } from '../../../types/prisma/User/user-me';

export function useMe() {
  const { data, isValidating, mutate } = useSWR<UserMe>('/api/me', null);
  if (!data) redirect('/signin');
  return { data, isValidating, mutate };
}
