import { ControlType } from '@okampus/shared/enums';
import { LabeledInput, SelectMenu, SingleFileInput } from '@okampus/ui/molecules';
import { Controller, useForm } from 'react-hook-form';
import type { ComplexFormField } from '@okampus/shared/types';

export interface DynamicFormProps {
  fields: ComplexFormField[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}

export function DynamicForm({ fields, onSubmit }: DynamicFormProps) {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 text-0">
      {fields.map((dynamicField) => (
        <Controller
          key={dynamicField.slug}
          name={dynamicField.slug}
          control={control}
          defaultValue={
            dynamicField.type === ControlType.MultiCheckbox
              ? dynamicField.options?.map(() => false) ?? []
              : dynamicField.default
          }
          // rules={dynamicField.config}
          render={({ field }) => {
            switch (dynamicField.type) {
              case ControlType.Div: {
                return (
                  <div>
                    <div className="text-1 text-xl">{dynamicField.label}</div>
                    <div className="text-2">{dynamicField.placeholder}</div>
                  </div>
                );
              }
              case ControlType.Radio: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.isRequired}
                    input={
                      <div className="flex flex-col gap-2">
                        {dynamicField.options?.map((option, idx) => (
                          <label key={option.value} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={field.name}
                              value={option.value}
                              checked={idx === field.value}
                              onChange={() => field.onChange(idx)}
                            />
                            <span>{option.label}</span>
                          </label>
                        ))}
                      </div>
                    }
                  />
                );
              }
              case ControlType.Select: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.isRequired}
                    input={
                      <SelectMenu
                        {...field}
                        items={dynamicField.options ?? []}
                        placeholder={dynamicField.placeholder || 'Votre choix'}
                        fullWidth={true}
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
                    required={dynamicField.isRequired}
                    input={<SingleFileInput {...field} />}
                  />
                );
              }
              case ControlType.Number: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.isRequired}
                    input={<input type="number" placeholder={dynamicField.placeholder} className="input" {...field} />}
                  />
                );
              }
              case ControlType.MultiCheckbox: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.isRequired}
                    input={
                      dynamicField.options &&
                      dynamicField.options.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {dynamicField.options?.map((option, idx) => (
                            <label key={option.value} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                name={field.name}
                                value={option.value}
                                checked={field.value[idx]}
                                onChange={() =>
                                  field.onChange([
                                    ...field.value.slice(0, idx),
                                    !field.value[idx],
                                    ...field.value.slice(idx + 1),
                                  ])
                                }
                              />
                              <span>{option.label}</span>
                            </label>
                          ))}
                        </div>
                      )
                    }
                  />
                );
              }
              case ControlType.DatetimeLocal: {
                return (
                  <LabeledInput
                    label={dynamicField.label}
                    name={field.name}
                    required={dynamicField.isRequired}
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
                    required={dynamicField.isRequired}
                    input={
                      <input
                        type="text"
                        placeholder={dynamicField.placeholder || 'Votre réponse'}
                        className="input"
                        {...field}
                      />
                    }
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
