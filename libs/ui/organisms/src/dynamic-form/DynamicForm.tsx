import { ControlType } from '@okampus/shared/enums';
import { LabeledInput, SelectMenu, SingleFileInput } from '@okampus/ui/molecules';
import { Controller, useForm } from 'react-hook-form';

import type { SelectItem } from '@okampus/shared/types';
import type { RegisterOptions } from 'react-hook-form';

export interface DynamicFieldData {
  label: string;
  inputType: ControlType;
  fieldName: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: unknown;
  options?: SelectItem<string>[];
  fullWidth?: boolean;
  config?: RegisterOptions;
}

export interface DynamicFormProps {
  fields: DynamicFieldData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}

export function DynamicForm({ fields, onSubmit }: DynamicFormProps) {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-0">
      {fields.map((dynamicField) => (
        <Controller
          key={dynamicField.fieldName}
          name={dynamicField.fieldName}
          control={control}
          defaultValue={dynamicField.defaultValue}
          rules={dynamicField.config}
          render={({ field }) => {
            switch (dynamicField.inputType) {
              case ControlType.Select: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.required}
                    input={
                      <SelectMenu
                        {...field}
                        items={dynamicField.options ?? []}
                        placeholder={dynamicField.placeholder}
                        fullWidth={dynamicField.fullWidth}
                      />
                    }
                  />
                );
              }
              case ControlType.SingleFile: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.required}
                    input={<SingleFileInput {...field} />}
                  />
                );
              }
              case ControlType.Number: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.required}
                    input={<input type="number" placeholder={dynamicField.placeholder} className="input" {...field} />}
                  />
                );
              }
              case ControlType.Checkbox: {
                return (
                  <LabeledInput
                    className="flex flex-row-reverse gap-1.5 px-2"
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.required}
                    input={<input type="checkbox" {...field} id={field.name} />}
                  />
                );
              }
              case ControlType.DatetimeLocal: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.required}
                    input={
                      <input
                        type="datetime-local"
                        placeholder={dynamicField.placeholder}
                        className="input"
                        {...field}
                      />
                    }
                  />
                );
              }
              default: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.required}
                    input={<input type="text" placeholder={dynamicField.placeholder} className="input" {...field} />}
                  />
                );
              }
            }
          }}
        />
      ))}
      <input type="submit" className="button bg-opposite text-opposite mt-2" value="Soumettre" />
    </form>
  );
}
