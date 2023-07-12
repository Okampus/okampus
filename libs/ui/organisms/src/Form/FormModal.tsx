import { FormSchemaRender } from './FormSchemaRender';

import { ControlType } from '@okampus/shared/enums';
import { isFormSubmission } from '@okampus/shared/types';
import { Modal } from '@okampus/ui/atoms';
import { ActionButton } from '@okampus/ui/molecules';
import { NavigationContext } from '@okampus/ui/hooks';

import { useContext, useState } from 'react';
import { useKeyPressEvent } from 'react-use';

import type { Submission, FormSchema, FormRenderProps } from '@okampus/shared/types';

export function getDefaultFormData<T extends FormSchema>(schema: T): Submission<T> {
  const data: Record<string, unknown> = {};
  for (const field of schema) {
    switch (field.type) {
      case ControlType.Radio: {
        data[field.name] = field.default || null;
        break;
      }
      case ControlType.Select: {
        data[field.name] = field.default || null;
        break;
      }
      case ControlType.Text: {
        data[field.name] = field.default || '';
        break;
      }
      case ControlType.Markdown: {
        data[field.name] = field.default || '';
        break;
      }
      case ControlType.Checkbox: {
        data[field.name] = field.default || false;
        break;
      }
      case ControlType.MultiCheckbox: {
        data[field.name] = field.default || field.options?.map((_) => false);
        break;
      }
      case ControlType.Number: {
        data[field.name] = field.default || '0';
        break;
      }
      default: {
        data[field.name] = field.default;
      }
    }
  }

  if (!isFormSubmission(schema, data)) throw new Error('Invalid form data');
  return data as Submission<T>;
}

export function FormModal<T extends FormSchema>({ title, schema, submitOptions }: FormRenderProps<T>) {
  submitOptions.label = submitOptions.label || 'Soumettre';

  const [data, setData] = useState(getDefaultFormData(schema));
  const { hideOverlay } = useContext(NavigationContext);

  useKeyPressEvent('Escape', hideOverlay);

  const content = <FormSchemaRender schema={schema} data={data} onChange={setData} />;

  const action = {
    iconOrSwitch: submitOptions.icon,
    label: submitOptions.label,
    type: submitOptions.type,
    linkOrActionOrMenu: () => submitOptions.onSubmit(data),
  };
  const button = <ActionButton action={action} iconPosition={submitOptions.iconPosition} className="w-full" />;

  return (
    <Modal header={title} footer={button}>
      {content}
    </Modal>
  );
}
