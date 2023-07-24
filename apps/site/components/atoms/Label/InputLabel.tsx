import { clsx } from 'clsx';

export type InputLabelProps = {
  label: string;
  name?: string;
  selected?: boolean;
  required?: boolean;
};
export default function InputLabel({ label, name, selected, required }: InputLabelProps) {
  return (
    <label {...(name && { htmlFor: name })} className={clsx('z-20 input-label', selected && 'selected')}>
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
}
