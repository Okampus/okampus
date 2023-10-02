'use client';

import TextInput from '../TextInput';
import ActionButton from '../../Button/ActionButton';
import ModalLayout from '../../../atoms/Layout/ModalLayout';
import { useModal } from '../../../../_hooks/context/useModal';

import { ActionType } from '@okampus/shared/types';
import { useState } from 'react';

export type LegalUnitInputConfirmProps = {
  headerLabel?: string;
  inputPlaceholder?: string;
  initialName: string;
  onSubmit: (name: string) => void;
};
export default function LegalUnitInputConfirm({
  headerLabel,
  inputPlaceholder,
  initialName,
  onSubmit,
}: LegalUnitInputConfirmProps) {
  const { closeModal } = useModal();
  const [legalUnitName, setLegalUnitName] = useState(initialName);

  return (
    <ModalLayout
      contentClassName="flex flex-col"
      header={headerLabel ?? 'Ajouter une entité légale'}
      footer={
        <div className="flex items-center gap-6">
          <ActionButton action={{ type: ActionType.Action, label: 'Annuler', linkOrActionOrMenu: closeModal }} />
          <ActionButton
            action={{ label: 'Valider', linkOrActionOrMenu: () => onSubmit(legalUnitName.toUpperCase().trim()) }}
          />
        </div>
      }
    >
      <span>&quot;{legalUnitName.toUpperCase().trim()}&quot; est introuvable dans la liste ?</span>
      <span className="mb-6">Assurez-vous de son orthographe puis validez pour l&apos;ajouter.</span>
      <TextInput
        name="legalUnitName"
        value={legalUnitName.toUpperCase()}
        onChange={(event) => setLegalUnitName(event.target.value)}
        placeholder={inputPlaceholder ?? "Nom de l'entité légale"}
      />
    </ModalLayout>
  );
}
