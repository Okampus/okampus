'use client';

import FormEditor from '../../organisms/FormEditor/FormEditor';
import { useBottomSheet } from '../../../_hooks/context/useBottomSheet';
import { ClipboardText } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';

import type { FormMinimal } from '../../../../types/prisma/Form/form-minimal';

export type FormItemProps = { form: FormMinimal; name: string };

export default function FormItem({ form, name }: FormItemProps) {
  const [isActive, setIsActive] = useState(false);

  const { openBottomSheet, isBottomSheetOpen } = useBottomSheet();

  useEffect(() => {
    if (!isBottomSheetOpen && isActive) setIsActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBottomSheetOpen]);

  const title = (
    <>
      <ClipboardText className="w-8 h-8" />
      {name}
    </>
  );
  useEffect(() => {
    if (isActive) openBottomSheet({ node: <FormEditor form={form} name={name} />, header: title });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div
      className="flex items-center px-5 py-3 gap-4 hover:bg-[var(--bg-1)] border rounded-lg border-[var(--border-3)] cursor-pointer"
      onClick={() => {
        openBottomSheet({ node: <FormEditor form={form} name={name} />, header: title });
        setIsActive(true);
      }}
    >
      <ClipboardText className="h-6 aspect-square text-2" />
      <div className="w-full flex items-start justify-between gap-4">
        <div className="font-medium line-clamp-1">{name}</div>
        <span className="button-underline">Modifier</span>
      </div>
    </div>
  );
}
