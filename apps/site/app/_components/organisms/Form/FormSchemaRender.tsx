'use client';

// import DateInput from '../Input/DateInput';
import Field from '../../molecules/Input/Field';
import FieldSet from '../../molecules/Input/FieldSet';
import RadioInput from '../../molecules/Input/Uncontrolled/String/RadioInput';
import SelectInput from '../../molecules/Input/Controlled/Select/SelectInput';
import SwitchInput from '../../molecules/Input/Uncontrolled/Boolean/SwitchInput';
import TextInput from '../../molecules/Input/Uncontrolled/String/TextInput';

import { defaultFormData } from '../../../../utils/default-form-data';

// import CheckboxInput from '../../molecules/Input/Selector/CheckboxInput';
import { ControlType } from '@okampus/shared/enums';

import clsx from 'clsx';

import { FormProvider, useForm } from 'react-hook-form';
import type { FormSchema } from '@okampus/shared/types';

export type FormSchemaRenderProps = {
  schema: FormSchema;
  className?: string;
  disabled?: boolean;
};
export default function FormSchemaRender({ schema, className, disabled = false }: FormSchemaRenderProps) {
  const values = defaultFormData(schema);
  const methods = useForm({ ...(values && { defaultValues: values }) });

  return (
    <FormProvider {...methods}>
      <form className={clsx('flex flex-col text-1 gap-6 md-max:min-w-[24rem] md:min-w-[30rem]', className)}>
        {schema.map((field) => {
          const placeholder = field.placeholder ?? 'Votre réponse';
          const options = { disabled, placeholder, required: field.required, name: field.name };

          let input = null;

          // // TODO: add other types
          switch (field.type) {
            case ControlType.Div: {
              input = (
                <div>
                  <div className="text-1 text-xl">{field.label}</div>
                  <div className="text-2">{field.placeholder}</div>
                </div>
              );
              break;
            }
            case ControlType.Radio: {
              // const selected = typeof data === 'number' ? data : null;
              input = (
                <FieldSet label={field.label}>
                  {field.options?.map((option) => {
                    return (
                      <RadioInput
                        {...methods.register(field.name)}
                        key={field.name}
                        name={field.name}
                        label={option.label}
                        defaultValue={option.value}
                        // defaultChecked={idx === selected}
                        // onChange={(event) => onInputChange(event.target.value)}
                      />
                    );
                  })}
                </FieldSet>
              );
              break;
            }
            case ControlType.Select: {
              input = (
                <SelectInput
                  control={methods.control}
                  name={field.name}
                  error={methods.formState.errors[field.name]?.message}
                  options={field.options ?? []}
                  label={field.label}
                />
              );
              break;
            }
            case ControlType.File: {
              // const value = typeof data === 'string' ? data : null;
              // input = (
              //   <Controller
              //     control={methods.control}
              //     name={field.name}
              //     render={({ field: fileField }) => (
              //       <FileInput
              //         {...options}
              //         entityName={EntityNames.FormSubmission}
              //         // name={field.name}
              //         value={fileField.value}
              //         onChange={fileField.onChange}
              //       />
              //     )}
              //   />
              // );
              break;
            }
            case ControlType.Number: {
              // const value = typeof data === 'string' ? data : '';
              // TODO: number input
              // input = (
              //   <TextInput
              //     {...methods.register(field.name)}
              //     // type="number"
              //     // name={field.name}
              //     // step={0.01}
              //     // value={value}
              //     // onChange={(event) => onInputChange(event.target.value)}
              //   />
              // );
              break;
            }
            case ControlType.Checkbox: {
              input = (
                <SwitchInput
                  {...options}
                  // {...methods.register(field.name)}
                  // name={field.name}
                  // checked={typeof data === 'boolean' ? data : false}
                  // onChange={(event) => onInputChange(event.target.checked)}
                />
              );
              break;
            }
            // case ControlType.MultiCheckbox: {
            //   const selected = Array.isArray(data) ? data : field.options?.map(() => false) ?? [];
            //   input = (
            //     <Field name={field.name}>
            //       {field.options?.map((option, idx) => {
            //         return (
            //           <CheckboxInput
            //             name={field.name}
            //             label={option.label}
            //             defaultValue={option.value}
            //             defaultChecked={selected[idx]}
            //             onChange={() => onInputChange(setAtIndexMap(selected, idx, !selected[idx]))}
            //           />
            //         );
            //       })}
            //     </Field>
            //   );
            //   break;
            // }
            // case ControlType.DatetimeLocal: {
            //   const date = data ? new Date(data.toString()) : new Date();
            //   return <DateInput date={date} onChange={() => onInputChange(date.toISOString())} options={options} />;
            // }
            default: {
              // const value = typeof data === 'string' ? data : '';
              input = (
                <TextInput
                  // name={field.name}
                  {...options}
                  // {...methods.register(field.name)}
                  // onChange={(event) => onInputChange(event.target.value)}
                />
              );
              break;
            }
          }

          return (
            <Field name={field.name} key={field.name}>
              {input}
            </Field>
            // <div key={field.name} className="p-6 md:rounded-2xl bg-1 flex flex-col gap-6">
            //   {field.label && <div className="text-0 text-lg font-semibold">{field.label}</div>}
            //   {input}
            // </div>
          );
        })}
      </form>
    </FormProvider>
  );
}
