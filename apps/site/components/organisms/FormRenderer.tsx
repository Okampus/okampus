'use client';

import BottomSheetLayout from '../atoms/Layout/BottomSheetLayout';
import ActionButton from '../molecules/Button/ActionButton';
import FormSchemaRender from '../molecules/Form/FormSchemaRender';

import { isBottomSheetOpenAtom } from '../../context/global';
import { defaultFormData } from '../../utils/default-form-data';

import { ActionType } from '@okampus/shared/types';

import { useAtom } from 'jotai';
import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';

import type { FormBaseInfo } from '@okampus/shared/graphql';
import type { FormField, FormSchema, Submission } from '@okampus/shared/types';

export type FormRendererProps = {
  form: FormBaseInfo;
  formName?: string;
  onSubmit: (data: Submission<FormSchema>) => void;
};
export default function FormRenderer({ form, formName, onSubmit }: FormRendererProps) {
  const [, setIsBottomSheetOpen] = useAtom(isBottomSheetOpenAtom);
  useKeyPressEvent('Escape', () => setIsBottomSheetOpen(false));

  const [data, setData] = useState(defaultFormData(form.schema as FormField[]));

  return (
    <BottomSheetLayout
      topbar={
        <div className="w-full text-center line-clamp-1 text-0 font-semibold text-lg">{formName ?? form.name}</div>
      }
      content={
        <div className="max-w-4xl w-full self-center">
          <FormSchemaRender className="my-5" data={data} onChange={setData} schema={form.schema as FormField[]} />
          <div className="flex justify-between">
            <ActionButton
              action={{
                type: ActionType.Primary,
                linkOrActionOrMenu: () => onSubmit(data),
                label: 'Envoyer',
              }}
            />

            <ActionButton
              action={{
                linkOrActionOrMenu: () => setData(defaultFormData(form.schema as FormField[])),
                label: 'Réinitialiser ma réponse',
              }}
            />
          </div>
        </div>
      }
    />
  );
}
