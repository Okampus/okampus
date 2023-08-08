import Field from './Field';
import clsx from 'clsx';
import { memo, forwardRef, createRef, useEffect } from 'react';
import { mergeRefs } from 'react-merge-refs';
import type { UncontrolledInput } from '@okampus/shared/types';

export type SwitchInputProps = UncontrolledInput<boolean> & {
  wrapperClassName?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'className' | 'placeholder' | 'type'>;

export default memo(
  forwardRef<HTMLInputElement, SwitchInputProps>(function TextInput(props, ref) {
    const localRef = createRef<HTMLInputElement>();

    useEffect(() => {
      if (props.defaultValue && localRef.current) localRef.current.checked = props.defaultValue;
    }, [props.defaultValue, localRef]);

    const {
      name,
      onChange,
      error,
      info,
      loading,
      className,
      wrapperClassName,
      label,
      defaultValue,
      disabled,
      required,
      description,
      ...inputProps
    } = props;

    const input = (
      <input
        ref={mergeRefs([ref, localRef])}
        name={name}
        disabled={disabled}
        // eslint-disable-next-line jsx-a11y/aria-props
        aria-description={description}
        aria-invalid={typeof error === 'string'}
        hidden={true}
        className="hidden w-0 h-0 peer"
        checked={defaultValue}
        onChange={onChange}
        type="checkbox"
        {...inputProps}
      />
    );

    const fieldProps = { label, className, name, description, required, error, info, loading };
    return (
      <Field {...fieldProps} horizontal={true}>
        <span className={clsx(wrapperClassName, '[&>input:checked]:bg-[var(--success)] bg-2')}>
          {input}
          <span className="absolute inset-y-[3px] aspect-square rounded-full bg-white peer-checked:right-[3px] left-[3px]" />
        </span>
      </Field>
    );
  })
);
