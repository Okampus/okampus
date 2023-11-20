'use client';

import Field from '../Field';

import clsx from 'clsx';
import { Controller } from 'react-hook-form';
import { NumberFormatBase } from 'react-number-format';

import type { ControlledInput } from '@okampus/shared/types';
import type { NumericFormatProps } from 'react-number-format';

export type IBANInputProps = ControlledInput<string, true> & Omit<NumericFormatProps, 'value' | 'onChange'>;

type IBANInputInnerProps = {
  props: Omit<IBANInputProps, 'onChange'>;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

function IBANInputInner({ props, value, onChange }: IBANInputInnerProps) {
  const { label, className, name, description, required, error, info, loading, ...otherProps } = props;

  return (
    <Field {...{ label, className, name, description, required, error, info, loading }}>
      <NumberFormatBase
        {...otherProps}
        value={value}
        type="text"
        className={clsx('input max-h-[var(--h-input)]', error && 'invalid')}
        format={(value) =>
          value
            .replaceAll(/\s+/g, '')
            .replaceAll(/([\da-z]{4})/gi, '$1 ')
            .trim()
            .toLocaleUpperCase()
        }
        removeFormatting={(value) => value.replaceAll(/\s+/gi, '')}
        isValidInputCharacter={(char) => /^[\da-z]$/i.test(char)}
        getCaretBoundary={(value) => Array.from({ length: value.length + 1 }).map(() => true)}
        onValueChange={(values) => onChange(values.value.toLocaleUpperCase())}
        onKeyDown={(e) =>
          !/^(?:[\da-z]|backspace|delete|home|end|arrowleft|arrowright|shift|capslock|control|numlock|tab|paste|redo|undo)$/i.test(
            e.key,
          ) && e.preventDefault()
        }
      />
    </Field>
  );
}

export default function IBANInput(props: IBANInputProps) {
  const { value, onChange, ...otherProps } = props;
  if (props.control) {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { value, onChange } }) => <IBANInputInner {...{ value, onChange, props: otherProps }} />}
      />
    );
  }

  return <IBANInputInner {...{ value, onChange: props.onChange, props: otherProps }} />;
}
