import Field from '../../Field';
import { useUncontrolledInputConfig } from '../../../../../_hooks/useUncontrolledInputConfig';

import clsx from 'clsx';
import { memo, forwardRef, useRef, useEffect, useImperativeHandle } from 'react';

import type { UncontrolledInput } from '@okampus/shared/types';

const switchClassName = 'w-fit flex items-center justify-between cursor-pointer h-6 aspect-[1.8/1] rounded-full';
const switchButtonClassName =
  'cursor-pointer absolute top-[3px] bottom-[3px] aspect-square rounded-full bg-white peer-checked:right-[3px] peer-checked:left-[unset] left-[3px]';

export type SwitchInputProps = Omit<UncontrolledInput<boolean>, 'placeholder'>;

export default memo(
  forwardRef<HTMLInputElement, SwitchInputProps>(function SwitchInput(props, forwardedRef) {
    const localRef = useRef<HTMLInputElement>();

    useEffect(() => {
      if (props.defaultValue && localRef.current) localRef.current.checked = props.defaultValue;
    }, [props.defaultValue, localRef]);

    const { name, error, info, loading, className, label, defaultValue, disabled, required, description } = props;

    const { ref, ...registerProps } = useUncontrolledInputConfig({ name });

    useImperativeHandle(ref, () => localRef.current as HTMLInputElement);
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLInputElement);

    const a11yProps = { 'aria-invalid': typeof error === 'string', 'aria-description': description };
    const inputClassName = clsx(switchClassName, 'peer appearance-none border checked:bg-[var(--primary)]');

    const inputProps = { name, disabled, defaultChecked: defaultValue, className: inputClassName };
    const input = <input type="checkbox" {...a11yProps} {...inputProps} {...registerProps} />;

    return (
      <Field {...{ label, className, name, description, required, error, info, loading }} horizontal={true}>
        <span className="relative">
          {input}
          <button onClick={() => localRef.current?.click()} className={switchButtonClassName} />
        </span>
      </Field>
    );
  }),
);
