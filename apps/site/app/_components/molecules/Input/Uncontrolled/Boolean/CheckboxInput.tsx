import { useUncontrolledInputConfig } from '../../../../../_hooks/useUncontrolledInputConfig';
import Field from '../../Field';
import { memo, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';
import clsx from 'clsx';
import type { UncontrolledInput } from '@okampus/shared/types';

export type CheckboxInputProps = Omit<UncontrolledInput<boolean>, 'placeholder'>;

const checkboxClass = 'w-6 h-6 border rounded-full border-[var(--text-0)] grid place-content-center';
const beforeClass =
  'before:w-6 before:h-6 before:bg-[var(--info)] before:rounded before:opacity-0 before:transition-opacity before:duration-200 before:ease-in-out before:grid before:place-content-center';
const beforeImageClass =
  "before:content-[url(\"data:image/svg+xml;charset=utf-8,%3Csvg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3E%3Cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M1 5.917 5.724 10.5 15 1.5'/%3E%3C/svg%3E\")]";

const checkboxClassName = clsx(checkboxClass, beforeClass, beforeImageClass, 'checked:before:opacity-100');

// TODO: improve using https://nextui.org/docs/components/checkbox-group
export default memo(
  forwardRef<HTMLInputElement, CheckboxInputProps>(function CheckboxInput(props, forwardedRef) {
    const localRef = useRef<HTMLInputElement>();

    useEffect(() => {
      if (props.defaultValue && localRef.current) localRef.current.checked = props.defaultValue;
    }, [props.defaultValue, localRef]);

    const { name, error, info, loading, className, label, defaultValue, disabled, required, description } = props;

    const { ref, ...registerProps } = useUncontrolledInputConfig({ name });

    useImperativeHandle(ref, () => localRef.current as HTMLInputElement);
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLInputElement);

    const a11yProps = { 'aria-invalid': typeof error === 'string', 'aria-description': description };
    const inputProps = { name, disabled, defaultChecked: defaultValue, className: checkboxClassName };

    return (
      <Field {...{ label, className, name, description, required, error, info, loading }} horizontal={true}>
        <input type="checkbox" {...a11yProps} {...inputProps} {...registerProps} />
        {label}
      </Field>
    );
  }),
);
