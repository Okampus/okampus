'use client';

import TextInput from '../../Uncontrolled/String/TextInput';
import SubmitButton from '../../../Form/SubmitButton';

import { useModal } from '../../../../../_hooks/context/useModal';
import { useState } from 'react';

export type LegalUnitInputConfirmProps = {
  inputPlaceholder?: string;
  initialName: string;
  onSubmit: (name: string) => void;
};
export default function LegalUnitInputConfirm({ inputPlaceholder, initialName, onSubmit }: LegalUnitInputConfirmProps) {
  const { closeModal } = useModal();
  const [legalUnitName, setLegalUnitName] = useState(initialName);

  return (
    <form>
      <span>&quot;{legalUnitName.toUpperCase().trim()}&quot; est introuvable dans la liste ?</span>
      <span className="mb-6">Assurez-vous de son orthographe puis validez pour l&apos;ajouter.</span>
      <TextInput name="legalUnitName" placeholder={inputPlaceholder ?? "Nom de l'entité légale"} />
      <SubmitButton className="mt-6" />
    </form>
  );
}
