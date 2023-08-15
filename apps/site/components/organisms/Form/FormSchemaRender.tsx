// import DateInput from '../Input/DateInput';
import Field from '../../molecules/Input/Field';
import RadioInput from '../../molecules/Input/Selector/RadioInput';
import SelectInput from '../../molecules/Input/Select/SelectInput';
import FileInput from '../../molecules/Input/File/FileInput';
import SwitchInput from '../../molecules/Input/SwitchInput';
import TextInput from '../../molecules/Input/TextInput';

import { defaultFormData } from '../../../utils/default-form-data';

// import CheckboxInput from '../../molecules/Input/Selector/CheckboxInput';
import { ControlType } from '@okampus/shared/enums';

import clsx from 'clsx';

import type { FormFieldValue, FormSchema, Submission } from '@okampus/shared/types';

export type FormSchemaRenderProps<T> = {
  schema: T;
  className?: string;
  data?: Submission<T>;
  onChange?: (data: Submission<T>) => void;
  disabled?: boolean;
};
export default function FormSchemaRender<T extends FormSchema>({
  schema,
  className,
  data,
  onChange,
  disabled = false,
}: FormSchemaRenderProps<T>) {
  const values = data ?? (defaultFormData(schema) as Submission<T>);

  return (
    <div className={clsx('flex flex-col text-1 gap-6 md-max:min-w-[24rem] md:min-w-[30rem]', className)}>
      {schema.map((field) => {
        const data = values[field.name];
        const options = {
          disabled,
          placeholder: field.placeholder ?? 'Votre réponse',
          required: field.required,
          name: field.name,
        };

        function onInputChange<T extends ControlType>(value: FormFieldValue<T>) {
          onChange?.({ ...values, [field.name]: value });
        }

        let input = null;
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
            const selected = typeof data === 'number' ? data : null;
            input = (
              <Field name={field.name}>
                {field.options?.map((option, idx) => {
                  return (
                    <RadioInput
                      {...options}
                      key={field.name}
                      name={field.name}
                      label={option.label}
                      defaultValue={option.value}
                      defaultChecked={idx === selected}
                      onChange={(event) => onInputChange(event.target.value)}
                    />
                  );
                })}
              </Field>
            );
            break;
          }
          case ControlType.Select: {
            input = (
              <SelectInput
                {...options}
                name={field.name}
                value={data}
                options={field.options ?? []}
                onChange={(data) => onInputChange(data as FormFieldValue<ControlType>)}
              />
            );
            break;
          }
          case ControlType.File: {
            input = (
              <FileInput
                {...options}
                name={field.name}
                onChange={(event) => onInputChange(event.target.files ?? new FileList())}
              />
            );
            break;
          }
          case ControlType.Number: {
            const value = typeof data === 'string' ? data : '';
            input = (
              <TextInput
                {...options}
                type="number"
                name={field.name}
                step={0.01}
                value={value}
                onChange={(event) => onInputChange(event.target.value)}
              />
            );
            break;
          }
          case ControlType.Checkbox: {
            input = (
              <SwitchInput
                {...options}
                name={field.name}
                checked={typeof data === 'boolean' ? data : false}
                onChange={(event) => onInputChange(event.target.checked)}
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
            const value = typeof data === 'string' ? data : '';
            input = (
              <TextInput
                {...options}
                name={field.name}
                value={value}
                onChange={(event) => onInputChange(event.target.value)}
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
    </div>
  );
}
