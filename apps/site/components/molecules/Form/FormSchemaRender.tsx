// import DateInput from '../Input/DateInput';
import MultiCheckboxInput from '../Input/MultiCheckboxInput';
import RadioInput from '../Input/RadioInput';
import SelectInput from '../Input/SelectInput';
import SingleFileInput from '../Input/SingleFileInput';
import SwitchInput from '../Input/SwitchInput';
import TextInput from '../Input/TextInput';

import { defaultFormData } from '../../../utils/default-form-data';

import { Buckets, ControlType, EntityName } from '@okampus/shared/enums';
import clsx from 'clsx';

import type { FormField, FormSchema, InputOptions, Submission } from '@okampus/shared/types';

type DataType = string | number | boolean | boolean[] | null;

type InputProps<T> = {
  field: FormField;
  data: DataType;
  values: Submission<T>;
  onChange?: (data: Submission<T>) => void;
  options: InputOptions;
};
function getInput<T>({ field, data, values, onChange, options }: InputProps<T>) {
  const onInputChange = (value: DataType) => onChange?.({ ...values, [field.name]: value });
  switch (field.type) {
    case ControlType.Div: {
      return (
        <div>
          <div className="text-1 text-xl">{field.label}</div>
          <div className="text-2">{field.placeholder}</div>
        </div>
      );
    }
    case ControlType.Radio: {
      const selected = typeof data === 'number' ? data : null;
      return <RadioInput items={field.options ?? []} selected={selected} onChange={onInputChange} options={options} />;
    }
    case ControlType.Select: {
      return <SelectInput value={data} items={field.options ?? []} onChange={onInputChange} options={options} />;
    }
    case ControlType.SingleFile: {
      return (
        <SingleFileInput
          uploadContext={{ bucket: Buckets.Attachments, entityName: EntityName.Form }}
          onChange={onInputChange}
          options={options}
        />
      );
    }
    case ControlType.Number: {
      const value = typeof data === 'number' ? data.toFixed(2) : '';
      return <TextInput allowedChars={/[\d,.-]/} value={value} onChange={onInputChange} options={options} />;
    }
    case ControlType.Checkbox: {
      return (
        <SwitchInput checked={typeof data === 'boolean' ? data : false} onChange={onInputChange} options={options} />
      );
    }
    case ControlType.MultiCheckbox: {
      const selected = Array.isArray(data) ? data : field.options?.map(() => false) ?? [];
      const items = field.options ?? [];
      return <MultiCheckboxInput items={items} selected={selected} onChange={onInputChange} options={options} />;
    }
    // case ControlType.DatetimeLocal: {
    //   const date = data ? new Date(data.toString()) : new Date();
    //   return <DateInput date={date} onChange={() => onInputChange(date.toISOString())} options={options} />;
    // }
    default: {
      const value = typeof data === 'string' ? data : '';
      return <TextInput value={value} onChange={onInputChange} options={options} />;
    }
  }
}

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
        const options = { disabled, placeholder: 'Votre réponse', required: field.isRequired, name: field.name };
        const input = getInput<T>({ field, data, values, onChange, options });
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
