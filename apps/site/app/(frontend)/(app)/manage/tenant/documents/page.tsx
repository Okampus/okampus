'use client';

import ViewLayout from '../../../../../_components/atoms/Layout/ViewLayout';
import List from '../../../../../_components/molecules/List/List';
import RequiredDocumentCard from '../../../../../_views/RequiredDocument/RequiredDocumentCard';
import RequiredDocumentModal from '../../../../../_views/RequiredDocument/RequiredDocumentModal';

import { useTenantManage } from '../../../../../_context/navigation';
import { useModal } from '../../../../../_hooks/context/useModal';

import { TeamType } from '@okampus/shared/enums';
import { Plus } from '@phosphor-icons/react';

export default function TenantRequiredDocumentsPage() {
  const { tenantManage } = useTenantManage();
  const { openModal } = useModal();

  if (!tenantManage) return null;

  const requiredDocuments = tenantManage.requiredDocuments ?? [];
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
      <div className="card-title">Associations & clubs ({associationAndClubDocuments.length})</div>
      <Plus
        className="cursor-pointer"
        onClick={() => openModal({ node: <RequiredDocumentModal teamTypes={[TeamType.Association, TeamType.Club]} /> })}
      />
    </div>
  );

  const associationHeader = (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="card-title">Associations uniquement ({associationDocuments.length})</div>
      <Plus
        className="cursor-pointer"
        onClick={() => openModal({ node: <RequiredDocumentModal teamTypes={[TeamType.Association]} /> })}
      />
    </div>
  );

  const clubHeader = (
    <div className="flex flex-wrap gap-4 items-center">
      <div className="card-title">Clubs uniquement ({clubDocuments.length})</div>
      <Plus
        className="cursor-pointer"
        onClick={() => openModal({ node: <RequiredDocumentModal teamTypes={[TeamType.Club]} /> })}
      />
    </div>
  );

  return (
    <ViewLayout header="Documents à transmettre">
      <List heading={associationAndClubHeader} groupClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {associationAndClubDocuments.map((document) => (
          <RequiredDocumentCard key={document.id} requiredDocument={document} />
        ))}
      </List>
      <hr className="my-4 border-color-1" />
      <List heading={associationHeader} groupClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {associationDocuments.map((document) => (
          <RequiredDocumentCard key={document.id} requiredDocument={document} />
        ))}
      </List>
      <hr className="my-4 border-color-1" />
      <List heading={clubHeader} groupClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {clubDocuments.map((document) => (
          <RequiredDocumentCard key={document.id} requiredDocument={document} />
        ))}
      </List>
    </ViewLayout>
  );
}
