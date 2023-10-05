import clsx from 'clsx';

export type CheckboxInputProps = {
  label?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const checkboxClass = 'w-6 h-6 border rounded-full border-[var(--text-0)] grid place-content-center';
const beforeClass =
  'before:w-6 before:h-6 before:bg-[var(--info)] before:rounded before:opacity-0 before:transition-opacity before:duration-200 before:ease-in-out before:grid before:place-content-center';
const beforeImageClass =
  "before:content-[url(\"data:image/svg+xml;charset=utf-8,%3Csvg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 12'%3E%3Cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M1 5.917 5.724 10.5 15 1.5'/%3E%3C/svg%3E\")]";

const checkboxClassName = clsx(checkboxClass, beforeClass, beforeImageClass, 'checked:before:opacity-100');

export default function CheckboxInput(props: CheckboxInputProps) {
  const { label, ...inputProps } = props;

  return (
    <label className="flex gap-3 p-3 bg-3 rounded cursor-pointer hover:bg-[var(--bg-2)]">
      <input type="checkbox" className={checkboxClassName} {...inputProps} />
      {label}
    </label>
  );
}
