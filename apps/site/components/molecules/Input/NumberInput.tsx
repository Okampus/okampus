import TextInput from './TextInput';
import { validatePositiveNumber } from '../../../utils/form-validation/numeric';
import type { InputOptions } from '@okampus/shared/types';

export type NumberInputProps = {
  value: string;
  textAlign?: 'left' | 'right';
  onChange: (value: string) => void;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  options: InputOptions;
  className?: string;
  copyable?: boolean;
};

export default function NumberInput({
  value,
  textAlign,
  onChange,
  prefix,
  suffix,
  options,
  className,
  copyable,
}: NumberInputProps) {
  return (
    <TextInput
      allowedChars={/^\d*((,|\.)\d{0,2})?$/}
      className={className}
      textAlign={textAlign}
      copyable={copyable}
      checkValueError={validatePositiveNumber}
      value={value}
      onChange={onChange}
      options={options}
      prefix={prefix}
      suffix={suffix}
    />
  );
}
