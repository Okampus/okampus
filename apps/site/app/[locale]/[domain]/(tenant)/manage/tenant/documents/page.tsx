import BaseView from '../../../../../../_components/templates/BaseView';
import List from '../../../../../../_components/molecules/List/List';
import RequiredDocumentCard from '../../../../../../_views/RequiredDocument/RequiredDocumentCard';

// import { useModal } from '../../../../../../_hooks/context/useModal';

import prisma from '../../../../../../../database/prisma/db';

import { tenantDetails } from '../../../../../../../types/prisma/Tenant/tenant-details';
import { requiredDocumentMinimal } from '../../../../../../../types/prisma/RequiredDocument/required-document-minimal';
import { notFound } from 'next/navigation';
import { Plus } from '@phosphor-icons/react/dist/ssr';
import { TeamType } from '@prisma/client';

import type { DomainSlugParams } from '../../../../../../params.type';

export default async function TenantRequiredDocumentsPage({ params }: DomainSlugParams) {
  const tenantManage = await prisma.tenant.findFirst({
    where: { domain: params.domain },
    select: { ...tenantDetails.select, scopedRequiredDocuments: requiredDocumentMinimal },
  });

  // const { openModal } = useModal();

  if (!tenantManage) notFound();

  const requiredDocuments = tenantManage.scopedRequiredDocuments ?? [];
  const associationAndClubDocuments = requiredDocuments.filter(
    (document) => document.teamTypes?.includes(TeamType.Association) && document.teamTypes?.includes(TeamType.Club),
  );

  const associationDocuments = requiredDocuments.filter(
    (document) => document.teamTypes?.includes(TeamType.Association) && !document.teamTypes?.includes(TeamType.Club),
  );

  const clubDocuments = requiredDocuments.filter(
    (document) => !document.teamTypes?.includes(TeamType.Association) && document.teamTypes?.includes(TeamType.Club),
  );

  const associationAndClubHeader = (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="text-lg font-semibold text-[var(--text-0)]">
        Associations & clubs ({associationAndClubDocuments.length})
      </div>
      <Plus
        className="cursor-pointer"
        // onClick={() => openModal({ node: <RequiredDocumentModal teamTypes={[TeamType.Association, TeamType.Club]} /> })}
      />
    </div>
  );

  const associationHeader = (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="text-lg font-semibold text-[var(--text-0)]">
        Associations uniquement ({associationDocuments.length})
      </div>
      <Plus
        className="cursor-pointer"
        // onClick={() => openModal({ node: <RequiredDocumentModal teamTypes={[TeamType.Association]} /> })}
      />
    </div>
  );

  const clubHeader = (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="text-lg font-semibold text-[var(--text-0)]">Clubs uniquement ({clubDocuments.length})</div>
      <Plus
        className="cursor-pointer"
        // onClick={() => openModal({ node: <RequiredDocumentModal teamTypes={[TeamType.Club]} /> })}
      />
    </div>
  );

  return (
    <BaseView header="Documents à transmettre">
      <List heading={associationAndClubHeader} groupClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {associationAndClubDocuments.map((document) => (
          <RequiredDocumentCard key={document.id} requiredDocument={document} />
        ))}
      </List>
      <hr className="my-4 border-[var(--border-1)]" />
      <List heading={associationHeader} groupClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {associationDocuments.map((document) => (
          <RequiredDocumentCard key={document.id} requiredDocument={document} />
        ))}
      </List>
      <hr className="my-4 border-[var(--border-1)]" />
      <List heading={clubHeader} groupClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {clubDocuments.map((document) => (
          <RequiredDocumentCard key={document.id} requiredDocument={document} />
        ))}
      </List>
    </BaseView>
  );
}
