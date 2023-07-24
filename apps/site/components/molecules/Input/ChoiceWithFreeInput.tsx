import TextInput from './TextInput';
import clsx from 'clsx';

import { useState } from 'react';
import type { TextInputProps } from './TextInput';
import type { InputOptions, SelectItem } from '@okampus/shared/types';

export type ChoiceWithFreeInputProps = {
  items: SelectItem<string>[];
  className?: string;
  value: string;
  onChange: (value: string) => void;
  options?: InputOptions;
  props?: Omit<TextInputProps, 'value' | 'onChange'>;
};

export default function ChoiceWithFreeInput({
  items,
  className,
  value,
  onChange,
  options,
  props,
}: ChoiceWithFreeInputProps) {
  const itemIndex = items.findIndex((item) => item.value === value);

  const [selected, setSelected] = useState(itemIndex === -1 ? items.length : itemIndex);
  const [textValue, setTextValue] = useState(itemIndex === -1 ? value : '');

  const radioGroup = (
    <ul className={clsx('flex gap-1', className)}>
      {items.map(({ value: itemValue, label }, idx) => {
        return (
          <li
            key={idx}
            onClick={() => (onChange(itemValue), setSelected(idx))}
            className={clsx(selected === idx ? 'bg-2' : 'opacity-60 hover:opacity-100', 'button')}
          >
            {label}
          </li>
        );
      })}
      <li
        onClick={() => (setSelected(items.length), onChange(textValue))}
        className={clsx(selected !== items.length && 'opacity-60 hover:opacity-100', 'button !shrink')}
      >
        <TextInput value={textValue} onChange={(text) => (setTextValue(text), onChange(text))} {...props} />
      </li>
    </ul>
  );

  return options?.label ? (
    <fieldset className="border border-color-2 p-3 rounded">
      <legend className="text-2 opacity-90 text-base font-medium px-1">
        {options.label} {options.required && <div className="text-red-500">*</div>}
      </legend>
      {radioGroup}
    </fieldset>
  ) : (
    radioGroup
  );
}
