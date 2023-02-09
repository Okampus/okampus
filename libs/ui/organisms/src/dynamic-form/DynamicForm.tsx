import { SelectMenu, SingleFileInput } from '@okampus/ui/molecules';
import { Controller, useForm } from 'react-hook-form';

import type { SelectItem } from '@okampus/ui/molecules';
import type { RegisterOptions } from 'react-hook-form';

export type ControlType = 'text' | 'single-file' | 'select' | 'number' | 'checkbox' | 'datetime-local';
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

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
              case 'select': {
                return (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={field.name} className="font-medium text-[#BDBDBD]">
                      {dynamicField.label}
                    </label>
                    <SelectMenu
                      {...field}
                      items={dynamicField.options ?? []}
                      placeholder={dynamicField.placeholder}
                      fullWidth={dynamicField.fullWidth}
                    />
                  </div>
                );
              }
              case 'single-file': {
                return (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={field.name} className="font-medium text-[#BDBDBD]">
                      {dynamicField.label}
                    </label>
                    <SingleFileInput {...field} />
                  </div>
                );
              }
              case 'number': {
                return (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={field.name} className="font-medium text-[#BDBDBD]">
                      {dynamicField.label}
                    </label>
                    <input type="number" placeholder={dynamicField.placeholder} className="input" {...field} />
                  </div>
                );
              }
              case 'checkbox': {
                return (
                  <div className="flex gap-1.5 px-2">
                    <input type="checkbox" {...field} id={field.name} />
                    <label htmlFor={field.name}>
                      {dynamicField.label}
                      {dynamicField.required && '*'}
                    </label>
                  </div>
                );
              }
              case 'datetime-local': {
                return (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={field.name} className="font-medium text-[#BDBDBD]">
                      {dynamicField.label}
                    </label>
                    <input type="datetime-local" placeholder={dynamicField.placeholder} className="input" {...field} />
                  </div>
                );
              }
              default: {
                return (
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={field.name} className="font-medium text-[#BDBDBD]">
                      {dynamicField.label}
                    </label>
                    <input type="text" placeholder={dynamicField.placeholder} className="input" {...field} />
                  </div>
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
