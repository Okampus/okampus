'use client';

import FormSchemaRender from './Form/FormSchemaRender';
import BottomSheetLayout from '../atoms/Layout/BottomSheetLayout';
import ActionButton from '../molecules/Button/ActionButton';

import { isBottomSheetOpenAtom } from '../../context/global';
import { defaultFormData } from '../../utils/default-form-data';

import { ActionType } from '@okampus/shared/types';

import { useAtom } from 'jotai';
import { useState } from 'react';
import { useKeyPressEvent } from 'react-use';

import type { FormSchema, Submission } from '@okampus/shared/types';
import type { FormMinimalInfo } from '../../types/features/form.info';

export type FormRendererProps = {
  form: FormMinimalInfo;
  formName?: string;
  onSubmit: (data: Submission<FormSchema>) => void;
};
export default function FormRenderer({ form, formName, onSubmit }: FormRendererProps) {
  const [, setIsBottomSheetOpen] = useAtom(isBottomSheetOpenAtom);
  useKeyPressEvent('Escape', () => setIsBottomSheetOpen(false));

  // TODO: create a guard to ensure correct form schemas
  const schema = form.schema as FormSchema;
  const [data, setData] = useState(defaultFormData(schema));

  return (
    <BottomSheetLayout
      topbar={
        <div className="w-full text-center line-clamp-1 text-0 font-semibold text-lg">{formName ?? form.name}</div>
      }
      content={
        <div className="max-w-4xl w-full self-center">
          <FormSchemaRender className="my-5" data={data} onChange={setData} schema={schema} />
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
                linkOrActionOrMenu: () => setData(defaultFormData(schema)),
                label: 'Réinitialiser ma réponse',
              }}
            />
          </div>
        </div>
      }
    />
  );
}
