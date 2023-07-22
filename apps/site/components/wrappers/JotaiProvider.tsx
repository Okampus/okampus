'use client';

import { Provider } from 'jotai/react';

export type JotaiProviderProps = { children: React.ReactNode };
export default function JotaiProvider({ children }: JotaiProviderProps) {
  return <Provider>{children}</Provider>;
}
