'use client';

import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import Button from '../../_components/molecules/Button/Button';
import SearchInput from '../../_components/molecules/Input/Other/SearchInput';
import BaseView from '../../_components/templates/BaseView';

import { ActionType } from '@okampus/shared/enums';
import { Plus } from '@phosphor-icons/react';

import Link from 'next/link';
import { useState } from 'react';
import type { TeamVendorMinimal } from '../../../types/prisma/TeamVendor/team-vendor-minimal';

export type TeamVendorsViewProps = {
  teamSlug: string;
  teamVendors: TeamVendorMinimal[];
  // actor: ActorWithTags;
  header?: React.ReactNode;
};
export default function TeamVendorsView({ teamSlug, teamVendors }: TeamVendorsViewProps) {
  const [search, setSearch] = useState('');

  return (
    <>
      <BaseView
        sidePanelButton={null}
        unscrollable={true}
        paddingMode="none"
        innerClassName="h-full flex flex-col"
        header="Fournisseurs / Clients"
      >
        <div className="flex gap-6 px-[var(--px-content)] pb-6">
          <SearchInput value={search} onChange={setSearch} />
          <Button type={ActionType.Primary} action={`/manage/team/${teamSlug}/transactions/new`}>
            <Plus className="w-7 h-7" />
            Ajouter un fournisseur / client
          </Button>
        </div>
        <div className="grid-layout">
          {teamVendors.map((vendor) => (
            <Link key={vendor.id} href={`/manage/team/${teamSlug}/vendors/${vendor.id}`} className="card-list">
              <div className="flex items-center gap-4">
                <AvatarImage name={vendor.name} website={vendor.website} />
                <div>
                  <div className="text-1 font-semibold text-lg mb-2">{vendor.name}</div>
                  {vendor.legalUnit &&
                    vendor.legalUnit.uniqueCodes.map((code) => (
                      <div key={code.codeType} className="text-2 text-sm">
                        {code.codeType} : {code.code}
                      </div>
                    ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </BaseView>
    </>
  );
}
