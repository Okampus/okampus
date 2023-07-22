'use client';

import { atomMap } from '../../context/global';
import { isIn, isNotNull } from '@okampus/shared/utils';

import { useHydrateAtoms } from 'jotai/utils';
import type { WritableAtom } from 'jotai';

export type JotaiInitializeProps = {
  initialValues: ReadonlyArray<readonly [keyof typeof atomMap, unknown]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type InitialValuesAtoms = [WritableAtom<any, any[], any>, any][];

export default function JotaiInitialize({ initialValues }: JotaiInitializeProps) {
  const initialValuesAtoms = initialValues
    .map(([atom, value]) => (isIn(atom, atomMap) ? [atomMap[atom], value] : null))
    .filter(isNotNull) as InitialValuesAtoms;

  useHydrateAtoms(initialValuesAtoms);
  return null;
}
