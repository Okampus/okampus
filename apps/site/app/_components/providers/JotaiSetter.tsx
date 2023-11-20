'use client';

import { atomMap } from '../../_context/global';
import { useAtom } from 'jotai';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JotaiSetterProps = { key: keyof typeof atomMap; value: any };

export default function JotaiSetter({ key, value }: JotaiSetterProps) {
  const [, setAtom] = useAtom(atomMap[key]);
  setAtom(value);

  return null;
}
