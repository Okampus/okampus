import clsx from 'clsx';

export type RadioInputProps = {
  label?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const radioClass = 'w-6 h-6 border-2 rounded-full border-[var(--text-0)] grid place-content-center';
const beforeClass =
  'before:w-4 before:h-4 before:bg-[var(--text-0)] before:rounded-full before:transform before:scale-0 before:transition-transform before:duration-200 before:ease-in-out before:opacity-0 before:grid before:place-content-center before:after:before';

const radioClassName = clsx(radioClass, beforeClass, 'checked:before:scale-100');

export default function RadioInput(props: RadioInputProps) {
  const { label, ...inputProps } = props;

  return (
    <label className="flex gap-3 p-3 bg-3 rounded cursor-pointer hover:bg-[var(--bg-2)]">
      <input type="radio" className={radioClassName} {...inputProps} />
      {label}
    </label>
  );
}
