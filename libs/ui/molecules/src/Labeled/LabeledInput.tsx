export type LabeledInputProps = {
  className?: string;
  label: string;
  name: string;
  required?: boolean;
  input: React.ReactNode;
};

export function LabeledInput({ className = 'flex flex-col gap-1.5', label, name, required, input }: LabeledInputProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="font-medium text-3 flex">
        {label}
        {required && <div className="text-red-500">*</div>}
      </label>
      {input}
    </div>
  );
}
