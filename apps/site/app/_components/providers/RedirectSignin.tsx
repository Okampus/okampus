'use client';

import { buildUrl } from '@okampus/shared/utils';
import { redirect, usePathname } from 'next/navigation';

import type { ErrorCode } from '../../../server/error';

export default function RedirectSignin({ error }: { error?: ErrorCode }) {
  const pathname = usePathname();
  const params = { error, next: pathname === 'signin' ? '/' : pathname ?? '/' };

  if (pathname !== 'signin' || error) redirect(buildUrl('/signin', params));
  return null;
}
