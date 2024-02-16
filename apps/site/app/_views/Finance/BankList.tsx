'use client';

import AvatarImage from '../../_components/atoms/Image/AvatarImage';
import { SearchView } from '../../_components/templates/SearchView';
import { baseUrl, protocol } from '../../../config';
import Link from 'next/link';
import type { BankMinimal } from '../../../types/prisma/Bank/bank-minimal';

export type BankListProps = { banks: BankMinimal[]; teamId: bigint; domain: string };
export default function BankList({ banks, teamId, domain }: BankListProps) {
  return (
    <SearchView
      emptyState="Aucune banque trouvée. Veuillez vérifier votre orthographe."
      innerClassName="grid-layout !grid-cols-[repeat(auto-fill,minmax(19rem,1fr))]"
      options={banks.map((bank) => ({
        searchText: `${bank.name} / ${bank.bic}`,
        label: (
          <Link
            href={`${protocol}://${domain}.${baseUrl}/api/bank/requisition?teamId=${teamId}&institutionId=${bank.goCardLessInstitutionId}`}
            className="flex items-center gap-4 card-list"
          >
            <AvatarImage src={bank.actor.avatar} name={bank.name} className="rounded-[50%]" />
            <div>
              <div className="text-1 font-semibold text-lg">{bank.name}</div>
              <div className="text-0 text-sm">BIC : {bank.bic}</div>
            </div>
          </Link>
        ),
      }))}
    />
  );
}
