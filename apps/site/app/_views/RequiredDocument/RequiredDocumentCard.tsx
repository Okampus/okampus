'use client';

import RequiredDocumentModal from './RequiredDocumentModal';
import ITag from '../../_components/atoms/Inline/ITag';

import { useModal } from '../../_hooks/context/useModal';

import type { RequiredDocumentMinimal } from '../../../types/prisma/RequiredDocument/required-document-minimal';

type RequiredDocumentCardProps = { requiredDocument: RequiredDocumentMinimal };
export default function RequiredDocumentCard({ requiredDocument }: RequiredDocumentCardProps) {
  const { openModal } = useModal();
  const { id: _id, name, description, isRequired, teamTypes } = requiredDocument;
  const id = _id.toString();

  const defaultValues = { name, description, isRequired: isRequired ? 'true' : 'false' };
  return (
    <div className="flex flex-col gap-2 px-4 py-2 border border-[var(--border-1)] rounded-md">
      <div className="flex flex-wrap">
        <div className="text-lg font-semibold text-[var(--text-0)] mr-2">{name}</div>
        {isRequired ? (
          <ITag content="Obligatoire" className="w-fit" />
        ) : (
          <ITag content="Facultatif" className="w-fit" />
        )}
      </div>
      <div className="line-clamp-2 text-1">{description}</div>
      <div className="flex flex-wrap gap-4">
        <button
          className="button-underline"
          onClick={() =>
            openModal({
              header: 'Modifier le document à transmettre',
              node: <RequiredDocumentModal teamTypes={teamTypes ?? []} id={id} defaultValues={defaultValues} />,
            })
          }
        >
          Modifier
        </button>
        <button
          className="button-underline !text-[var(--danger)]"
          onClick={
            () => {}
            // TODO
            // updateRequiredDocument({
            //   variables: { id, update: { deletedAt: new Date().toISOString() } },
            // })
          }
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
