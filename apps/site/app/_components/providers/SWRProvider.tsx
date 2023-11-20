'use client';

import { SWRConfig } from 'swr';

export type SWRProviderProps = { children: React.ReactNode; fallback?: Record<string, unknown> };
export default function SWRProvider({ children, fallback }: SWRProviderProps) {
  return <SWRConfig value={{ fallback }}>{children}</SWRConfig>;
}
