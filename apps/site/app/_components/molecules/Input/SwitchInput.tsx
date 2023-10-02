import Field from './Field';
import clsx from 'clsx';
import { memo, forwardRef, createRef, useEffect } from 'react';
import { mergeRefs } from 'react-merge-refs';
import type { UncontrolledInput } from '@okampus/shared/types';

const inputClassName = 'w-fit flex items-center justify-between cursor-pointer h-6 aspect-[1.8/1] rounded-full';

export type SwitchInputProps = UncontrolledInput<boolean> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'className' | 'placeholder' | 'type'>;

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
        className={clsx('peer appearance-none [&:checked]:bg-[var(--success)] bg-2 !bg-none', inputClassName)}
        checked={defaultValue}
        onChange={onChange}
        type="checkbox"
        {...inputProps}
      />
    );

    const fieldProps = { label, className, name, description, required, error, info, loading };
    return (
      <Field {...fieldProps} horizontal={true}>
        <span className="relative">
          {input}
          <span
            onClick={() => localRef.current?.click()}
            className="cursor-pointer absolute top-[3px] bottom-[3px] aspect-square rounded-full bg-white peer-checked:right-[3px] peer-checked:left-[unset] left-[3px]"
          />
        </span>
      </Field>
    );
  }),
);
