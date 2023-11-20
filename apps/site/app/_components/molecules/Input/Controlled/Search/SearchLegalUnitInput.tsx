'use client';

import ComboBoxInput from '../ComboBox/ComboBoxInput';
import IHighlight from '../../../../atoms/Inline/IHighlight';
import { formatAddress } from '../../../../../../utils/format/format-address';

import { Buildings } from '@phosphor-icons/react';

import type { LegalUnitMinimal } from '../../../../../../types/prisma/LegalUnit/legal-unit-minimal';
import type { ControlledInput } from '@okampus/shared/types';

const getOptionsKey = (search: string) => (search ? `/api/search/company?search=${search}` : null);
export default function LegalUnitInput(props: ControlledInput<LegalUnitMinimal, true>) {
  return (
    <ComboBoxInput
      {...props}
      placeholder={props.placeholder || 'Rechercher une adresse'}
      getOptionsKey={getOptionsKey}
      getOptions={async (searchUrl) => {
        if (!searchUrl) return [];
        return fetch(searchUrl)
          .then((res) => res.json())
          .then((legalUnits: LegalUnitMinimal[]) => {
            return legalUnits.map((legalUnit) => ({
              searchText: legalUnit.legalName,
              value: legalUnit,
              label: (
                <span className="flex items-center gap-2">
                  <Buildings weight="fill" className="h-5 w-5 shrink-0" />
                  <IHighlight
                    className="line-clamp-1 leading-4 h-5 shrink-0"
                    text={legalUnit.legalName}
                    highlight={searchUrl.split('=')[1]}
                  />
                  <span className="text-2 !font-medium text-sm line-clamp-1">
                    {legalUnit.address && formatAddress(legalUnit.address)}
                  </span>
                </span>
              ),
            }));
          });
      }}
    />
  );
}
