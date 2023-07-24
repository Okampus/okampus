'use client';

import FormEditor from '../../organisms/FormEditor';
import { bottomSheetAtom, isBottomSheetOpenAtom } from '../../../context/global';
import { IconCheckupList } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

import { useAtom } from 'jotai';
import type { FormBaseInfo } from '@okampus/shared/graphql';

export type FormItemProps = { form: FormBaseInfo };

export default function FormItem({ form }: FormItemProps) {
  const [isActive, setIsActive] = useState(false);

  const [, setBottomSheet] = useAtom(bottomSheetAtom);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useAtom(isBottomSheetOpenAtom);

  useEffect(() => {
    if (!isBottomSheetOpen && isActive) setIsActive(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBottomSheetOpen]);

  useEffect(() => {
    if (isActive) {
      setBottomSheet(<FormEditor form={form} />);
      setIsBottomSheetOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <div
      className="flex items-center px-5 py-3 gap-4 hover:bg-[var(--bg-1)] border rounded-lg border-color-3 cursor-pointer"
      onClick={() => {
        setBottomSheet(<FormEditor form={form} />);
        setIsBottomSheetOpen(true);
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
