import clsx from 'clsx';
import { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';

export type RadioInputProps = {
  isRadioBefore?: boolean;
  label?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const radioClass =
  'appearance-none w-[16px] h-[16px] outline outline-2 rounded-full outline-[var(--text-0)] checked:outline-[var(--info)] cursor-pointer';
const beforeClass =
  'before:absolute before:inset-[3px] before:w-[10px] before:h-[10px] before:bg-[var(--info)] before:content-[""] before:rounded-full before:transform before:scale-0 before:transition-transform before:duration-200 before:ease-in-out';

export default forwardRef<HTMLInputElement, RadioInputProps>(function RadioInput(props, ref) {
  const localRef = useRef<HTMLInputElement>(null);
  const { label, isRadioBefore, ...inputProps } = props;

  const radioClassName = clsx(
    radioClass,
    beforeClass,
    isRadioBefore ? 'left-3' : 'right-3',
    'peer absolute top-1/2 translate-y-[-50%] checked:before:scale-100',
  );

  const labelClassName = clsx(
    'outline outline-2 outline-[var(--border-1)] peer-checked:outline-[var(--info)] flex gap-3 py-3 px-3.5 bg-[var(--bg-input)] rounded-lg cursor-pointer hover:bg-[var(--bg-1)]',
    isRadioBefore ? 'pl-12 pr-3' : 'pl-3 pr-12',
  );

  return (
    <div className="relative grow">
      <input type="radio" ref={mergeRefs([localRef, ref])} className={radioClassName} {...inputProps} />
      <label onClick={() => localRef.current?.click()} htmlFor={inputProps.name} className={labelClassName}>
        {label}
      </label>
    </div>
  );
});
