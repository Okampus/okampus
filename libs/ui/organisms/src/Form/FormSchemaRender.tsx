import { ControlType } from '@okampus/shared/enums';
import {
  DateInput,
  MultiCheckboxInput,
  NumberInput,
  RadioInput,
  SelectInput,
  SingleFileInput,
  SwitchInput,
  TextInput,
} from '@okampus/ui/molecules';

import type { FormSchema, Submission } from '@okampus/shared/types';

export interface FormSchemaRenderProps<T> {
  schema: T;
  data: Submission<T>;
  onChange: (data: Submission<T>) => void;
}

export function FormSchemaRender<T extends FormSchema>({ schema, data, onChange }: FormSchemaRenderProps<T>) {
  console.log('Schema', schema, data);
  return (
    <div className="flex flex-col text-1 gap-6 min-w-[30rem]">
      {schema.map((dynamicField, idx) => {
        console.log(dynamicField);
        const name = dynamicField.name;
        const fieldData = data[name];

        switch (dynamicField.type) {
          case ControlType.Div: {
            return (
              <div key={idx}>
                <div className="text-1 text-xl">{dynamicField.label}</div>
                <div className="text-2">{dynamicField.placeholder}</div>
              </div>
            );
          }
          case ControlType.Radio: {
            // TODO: radio cards
            return (
              <RadioInput
                key={idx}
                items={dynamicField.options ?? []}
                selected={typeof fieldData === 'number' ? fieldData : null}
                onChange={(value) => onChange({ ...data, [dynamicField.name]: value })}
                options={{ label: dynamicField.label, required: dynamicField.isRequired, name: dynamicField.name }}
              />
            );
          }
          case ControlType.Select: {
            return (
              <SelectInput
                key={idx}
                value={fieldData}
                items={dynamicField.options ?? []}
                onChange={(value) => onChange({ ...data, [dynamicField.name]: value })}
                options={{ label: dynamicField.label, required: dynamicField.isRequired, name: dynamicField.name }}
              />
            );
          }
          case ControlType.SingleFile: {
            return (
              <SingleFileInput
                key={idx}
                onChange={(value) => onChange({ ...data, [dynamicField.name]: value })}
                options={{ label: dynamicField.label, required: dynamicField.isRequired, name: dynamicField.name }}
              />
            );
          }
          // TODO: manage file upload
          case ControlType.Number: {
            return (
              <NumberInput
                key={idx}
                value={typeof fieldData === 'number' ? fieldData : 0}
                onChange={(value) => onChange({ ...data, [dynamicField.name]: value })}
                options={{ label: dynamicField.label, required: dynamicField.isRequired, name: dynamicField.name }}
              />
            );
          }
          case ControlType.Checkbox: {
            return (
              <SwitchInput
                key={idx}
                checked={typeof fieldData === 'boolean' ? fieldData : false}
                onChange={(value) => onChange({ ...data, [dynamicField.name]: value })}
                options={{ label: dynamicField.label, required: dynamicField.isRequired, name: dynamicField.name }}
              />
            );
          }
          case ControlType.MultiCheckbox: {
            return (
              <MultiCheckboxInput
                key={idx}
                items={dynamicField.options ?? []}
                selected={Array.isArray(fieldData) ? fieldData : dynamicField.options?.map(() => false) ?? []}
                onChange={(value) => onChange({ ...data, [dynamicField.name]: value })}
                options={{ label: dynamicField.label, required: dynamicField.isRequired, name: dynamicField.name }}
              />
            );
          }
          case ControlType.DatetimeLocal: {
            return (
              <DateInput
                key={idx}
                date={new Date(fieldData.toString())}
                onChange={(value) => onChange({ ...data, [dynamicField.name]: value })}
                options={{ label: dynamicField.label, required: dynamicField.isRequired, name: dynamicField.name }}
              />
            );
          }
          default: {
            return (
              <TextInput
                key={idx}
                type="text"
                value={fieldData.toString()}
                onChange={(value) => onChange({ ...data, [dynamicField.name]: value })}
                options={{ label: dynamicField.label, required: dynamicField.isRequired, name: dynamicField.name }}
              />
            );
          }
        }
      })}
    </div>
  );
}
