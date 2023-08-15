'use client';

import FormEditor from '../../organisms/FormEditor/FormEditor';
import { useBottomSheet } from '../../../hooks/context/useBottomSheet';
import { IconCheckupList } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import type { FormMinimalInfo } from '../../../types/features/form.info';

export type FormItemProps = { form: FormMinimalInfo };

export default function FormItem({ form }: FormItemProps) {
  const [isActive, setIsActive] = useState(false);

  const { openBottomSheet, isBottomSheetOpen } = useBottomSheet();

  useEffect(() => {
    if (!isBottomSheetOpen && isActive) setIsActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBottomSheetOpen]);

  useEffect(() => {
    if (isActive) openBottomSheet({ node: <FormEditor form={form} /> });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div
      className="flex items-center px-5 py-3 gap-4 hover:bg-[var(--bg-1)] border rounded-lg border-color-3 cursor-pointer"
      onClick={() => {
        openBottomSheet({ node: <FormEditor form={form} /> });
        setIsActive(true);
      }}
    >
      <IconCheckupList className="h-6 aspect-square text-2" />
      <div className="w-full flex items-start justify-between gap-4">
        <div className="font-medium">{form.name}</div>
        <span className="add-button">Modifier</span>
      </div>
    </div>
  );
}
