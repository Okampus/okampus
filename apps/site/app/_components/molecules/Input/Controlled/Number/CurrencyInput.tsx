'use client';

import Field from '../../Field';

import { useLocale } from '../../../../../_hooks/context/useLocale';
import { memo, useMemo } from 'react';
import { Controller } from 'react-hook-form';
import { NumericFormat } from 'react-number-format';

import clsx from 'clsx';
import type { ControlledInput } from '@okampus/shared/types';
import type { NumericFormatProps } from 'react-number-format';
import type { Currency } from '@prisma/client';

export type CurrencyInputProps = ControlledInput<number, true> &
  Omit<NumericFormatProps, 'value' | 'onChange'> & {
    currency: Currency;
  };

type CurrencyInputInnerProps = {
  props: Omit<CurrencyInputProps, 'onChange'>;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

function CurrencyInputInner({ props, value, onChange }: CurrencyInputInnerProps) {
  const [locale] = useLocale();

  const { label, className, name, description, required, error, info, loading, currency, ...otherProps } = props;
  const currencySymbol = useMemo(
    () =>
      (0)
        .toLocaleString(locale, { style: 'currency', currency, minimumFractionDigits: 0, maximumFractionDigits: 0 })
        .replaceAll(/\d/g, ''),
    [locale, currency],
  );

  const numericFormatProps = {
    ...(locale === 'en-US'
      ? { prefix: currencySymbol, decimalSeparator: '.', thousandSeparator: ',' }
      : { suffix: ` ${currencySymbol}`, decimalSeparator: ',', thousandSeparator: ' ' }),
  };

  return (
    <Field {...{ label, className, name, description, required, error, info, loading }}>
      <NumericFormat
        name={name}
        {...otherProps}
        {...numericFormatProps}
        className={clsx('input max-h-[var(--h-input)]', error && 'invalid')}
        decimalScale={2}
        fixedDecimalScale={true}
        onValueChange={({ floatValue }) => onChange(floatValue ?? undefined)}
        value={value}
      />
    </Field>
  );
}

export default memo(function CurrencyInput(props: CurrencyInputProps) {
  if (props.control) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { value, onChange } }) => <CurrencyInputInner {...{ value, onChange, props }} />}
      />
    );
  }

  const innerProps = { value: props.value, onChange: props.onChange, props };
  return <CurrencyInputInner {...innerProps} />;
});
