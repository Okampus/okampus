// import DateInput from '../Input/DateInput';
import Field from '../../molecules/Input/Field';
import RadioInput from '../../molecules/Input/Selector/RadioInput';
import SelectInput from '../../molecules/Input/SelectInput';
import FileInput from '../../molecules/Input/File/FileInput';
import SwitchInput from '../../molecules/Input/SwitchInput';
import TextInput from '../../molecules/Input/TextInput';

import { defaultFormData } from '../../../utils/default-form-data';

import CheckboxInput from '../../molecules/Input/Selector/CheckboxInput';
import { ControlType } from '@okampus/shared/enums';

import { setAtIndexMap } from '@okampus/shared/utils';
import clsx from 'clsx';

import type { FormFieldValue, FormSchema, Submission } from '@okampus/shared/types';

// type InputProps<T extends ControlType> = {
//   field: FormFieldType<T>;
//   data: FormFieldValue<T>;
//   onChange?: (data: FormFieldValue<T>) => void;
// };

// function

// function getInput<T extends ControlType>(props: InputProps<T>) {
//   if (props.field.type === ControlType.Radio) {
//     const selected = typeof props.data === 'number' ? data : null;
//     return (
//       <Field name={field.name}>
//         {field.options?.map((option, idx) => {
//           return (
//             <RadioInput
//               key={idx}
//               name={field.name}
//               label={option.label}
//               defaultValue={option.value}
//               defaultChecked={idx === selected}
//               onChange={() => onChange?.(idx)}
//             />
//           );
//         })}
//       </Field>
//     );
//   }

//   switch (field.type) {
//     case ControlType.Div: {
//       return (
//         <div>
//           <div className="text-1 text-xl">{field.label}</div>
//           <div className="text-2">{field.placeholder}</div>
//         </div>
//       );
//     }
//     case ControlType.Radio: {
//       const selected = typeof data === 'number' ? data : null;
//       return (
//         <Field name={field.name}>
//           {field.options?.map((option, idx) => {
//             return (
//               <RadioInput
//                 name={field.name}
//                 key={idx}
//                 defaultChecked={idx === selected}
//                 onChange={() => onChange?.(idx)}
//               />
//             );
//           })}
//         </Field>
//       );
//       // return <RadioInput items={field.options ?? []} selected={selected} onChange={onInputChange} options={options} />;
//     }
//     case ControlType.Select: {
//       return <SelectInput value={data} items={field.options ?? []} onChange={onInputChange} options={options} />;
//     }
//     case ControlType.File: {
//       return (
//         <SingleFileInput
//           uploadContext={{ bucket: Buckets.Attachments, entityName: EntityName.Form }}
//           onChange={onInputChange}
//           options={options}
//         />
//       );
//     }
//     case ControlType.Number: {
//       const value = typeof data === 'number' ? data.toFixed(2) : '';
//       return <TextInput allowedChars={/[\d,.-]/} value={value} onChange={onInputChange} options={options} />;
//     }
//     case ControlType.Checkbox: {
//       return (
//         <SwitchInput checked={typeof data === 'boolean' ? data : false} onChange={onInputChange} options={options} />
//       );
//     }
//     case ControlType.MultiCheckbox: {
//       const selected = Array.isArray(data) ? data : field.options?.map(() => false) ?? [];
//       const items = field.options ?? [];
//       return <MultiCheckboxInput items={items} selected={selected} onChange={onInputChange} options={options} />;
//     }
//     // case ControlType.DatetimeLocal: {
//     //   const date = data ? new Date(data.toString()) : new Date();
//     //   return <DateInput date={date} onChange={() => onInputChange(date.toISOString())} options={options} />;
//     // }
//     default: {
//       const value = typeof data === 'string' ? data : '';
//       return <TextInput value={value} onChange={onInputChange} options={options} />;
//     }
//   }
// }

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
      {schema.map((field, idx) => {
        const data = values[field.name];
        const options = { disabled, placeholder: 'Votre réponse', required: field.required, name: field.name };

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
                      key={idx}
                      name={field.name}
                      label={option.label}
                      defaultValue={option.value}
                      defaultChecked={idx === selected}
                      onChange={() => onInputChange?.(idx)}
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
              <FileInput name={field.name} onChange={(event) => onInputChange(event.target.files ?? new FileList())} />
            );
            break;
          }
          case ControlType.Number: {
            const value = typeof data === 'number' ? data.toFixed(2) : '';
            input = (
              <TextInput
                name={field.name}
                type="number"
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
                name={field.name}
                checked={typeof data === 'boolean' ? data : false}
                onChange={(event) => onInputChange(event.target.checked)}
              />
            );
            break;
          }
          case ControlType.MultiCheckbox: {
            const selected = Array.isArray(data) ? data : field.options?.map(() => false) ?? [];
            input = (
              <Field name={field.name}>
                {field.options?.map((option, idx) => {
                  return (
                    <CheckboxInput
                      key={idx}
                      name={field.name}
                      label={option.label}
                      defaultValue={option.value}
                      defaultChecked={selected[idx]}
                      onChange={() => onInputChange(setAtIndexMap(selected, idx, !selected[idx]))}
                    />
                  );
                })}
              </Field>
            );
            break;
          }
          // case ControlType.DatetimeLocal: {
          //   const date = data ? new Date(data.toString()) : new Date();
          //   return <DateInput date={date} onChange={() => onInputChange(date.toISOString())} options={options} />;
          // }
          default: {
            const value = typeof data === 'string' ? data : '';
            input = (
              <TextInput name={field.name} value={value} onChange={(event) => onInputChange(event.target.value)} />
            );
            break;
          }
        }

        return (
          <div key={idx} className="p-6 md:rounded-2xl bg-1 flex flex-col gap-6">
            {field.label && <div className="text-0 text-lg font-semibold">{field.label}</div>}
            {input}
          </div>
        );
      })}
    </div>
  );
}
