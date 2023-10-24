import RequiredDocumentModal from './RequiredDocumentModal';
import ITag from '../../_components/atoms/Inline/ITag';

import { useModal } from '../../_hooks/context/useModal';

import { useUpdateRequiredDocumentMutation } from '@okampus/shared/graphql';

import type { RequiredDocumentInfo } from '../../../types/features/required-document.info';

type RequiredDocumentCardProps = { requiredDocument: RequiredDocumentInfo };
export default function RequiredDocumentCard({ requiredDocument }: RequiredDocumentCardProps) {
  const { openModal } = useModal();
  const { id: _id, name, description, isRequired, teamTypes } = requiredDocument;
  const id = _id.toString();

  const defaultValues = { name, description, isRequired: isRequired ? 'true' : 'false' };
  const [updateRequiredDocument] = useUpdateRequiredDocumentMutation();

  return (
    <div className="flex flex-col gap-2 px-4 py-2 border border-[var(--border-1)] rounded-md">
      <div className="flex flex-wrap">
        <div className="card-title mr-2">{name}</div>
        {isRequired ? (
          <ITag content="Obligatoire" className="w-fit" />
        ) : (
          <ITag content="Facultatif" className="w-fit" />
        )}
      </div>
      <div className="line-clamp-2 text-1">{description}</div>
      <div className="flex flex-wrap gap-4">
        <button
          className="add-button"
          onClick={() =>
            openModal({
              node: <RequiredDocumentModal teamTypes={teamTypes ?? []} id={id} defaultValues={defaultValues} />,
            })
          }
        >
          Modifier
        </button>
        <button
          className="add-button !text-[var(--danger)]"
          onClick={() =>
            updateRequiredDocument({
              variables: { id, update: { hiddenAt: new Date().toISOString() } },
            })
          }
        >
          Archiver
        </button>
        <button
          className="add-button !text-[var(--danger)]"
          onClick={() =>
            updateRequiredDocument({
              variables: { id, update: { deletedAt: new Date().toISOString() } },
            })
          }
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}
