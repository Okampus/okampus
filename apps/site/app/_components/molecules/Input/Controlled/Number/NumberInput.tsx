'use client';

import Field from '../../Field';

import { memo } from 'react';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import clsx from 'clsx';
import type { ControlledInput } from '@okampus/shared/types';
import type { NumericFormatProps } from 'react-number-format';

export type NumberInputProps = ControlledInput<number, true> & Omit<NumericFormatProps, 'value' | 'onChange'>;

type NumberInputInnerProps = {
  props: Omit<NumberInputProps, 'onChange'>;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

function NumberInputInner({ props, value, onChange }: NumberInputInnerProps) {
  const { label, className, name, description, required, error, info, loading, ...otherProps } = props;

  return (
    <Field {...{ label, className, name, description, required, error, info, loading }}>
      <NumericFormat
        {...otherProps}
        className={clsx('input max-h-[var(--h-input)]', error && 'invalid')}
        onValueChange={({ floatValue }) => onChange(floatValue ?? undefined)}
        value={value}
      />
    </Field>
  );
}

export default memo(function NumberInput(props: NumberInputProps) {
  const { value, onChange, ...otherProps } = props;
  if (props.control) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { value, onChange } }) => <NumberInputInner {...{ value, onChange, props: otherProps }} />}
      />
    );
  }

  return <NumberInputInner {...{ value, onChange: props.onChange, props: otherProps }} />;
});
