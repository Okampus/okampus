import FormSchemaRender from '../../organisms/Form/FormSchemaRender';
import ActionButton from '../../molecules/Button/ActionButton';
import { defaultFormData } from '../../../../utils/default-form-data';

import { ActionType } from '@okampus/shared/types';

import clsx from 'clsx';
import { useState } from 'react';

import type { Action, FormSchema, SubmissionType } from '@okampus/shared/types';

export type FormLayoutProps<T> = {
  schema: T;
  initialData?: SubmissionType<T>;
  className?: string;
  action?: Partial<Action>;
  onSubmit: (data: SubmissionType<T>) => void;
};

export default function FormLayout<T extends FormSchema>({
  schema,
  initialData,
  className,
  action,
  onSubmit,
}: FormLayoutProps<T>) {
  const [data, setData] = useState<SubmissionType<T>>(initialData || defaultFormData(schema));

  return (
    <div className={clsx(className, 'flex flex-col justify-end gap-4')}>
      <FormSchemaRender schema={schema} data={data} onChange={setData} />
      <ActionButton
        action={{ type: ActionType.Success, label: 'Soumettre', ...action, linkOrActionOrMenu: () => onSubmit(data) }}
      />
    </div>
  );
}
