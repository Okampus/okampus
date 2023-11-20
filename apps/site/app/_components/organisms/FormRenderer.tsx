'use client';

import FormSchemaRender from './Form/FormSchemaRender';
import Button from '../molecules/Button/Button';

import { defaultFormData } from '../../../utils/default-form-data';

import { ActionType } from '@okampus/shared/enums';
import { useState } from 'react';

import type { FormMinimal } from '../../../types/prisma/Form/form-minimal';
import type { FormSchema, SubmissionType } from '@okampus/shared/types';

export type FormRendererProps = { form: FormMinimal; submit: (data: SubmissionType) => void };
export default function FormRenderer({ form, submit }: FormRendererProps) {
  // TODO: create a guard to ensure correct form schemas
  const schema = form.schema as FormSchema;
  const [data, setData] = useState(defaultFormData(schema));

  return (
    <div className="max-w-4xl w-full self-center">
      <FormSchemaRender className="my-5" schema={schema} />
      <div className="flex justify-between">
        <Button type={ActionType.Primary} action={() => submit(data)}>
          Valider
        </Button>
        <Button action={() => setData(defaultFormData(schema))}>Réinitialiser ma réponse</Button>
      </div>
    </div>
  );
}
