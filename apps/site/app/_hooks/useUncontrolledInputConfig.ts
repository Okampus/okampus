import { RegisterOptions, useFormContext } from 'react-hook-form';

export type UseUncontrolledInputConfigOptions = { name: string } & RegisterOptions;
export function useUncontrolledInputConfig({ name, onBlur, onChange }: UseUncontrolledInputConfigOptions) {
  const methods = useFormContext();
  if (methods) return methods.register(name, { onBlur, onChange });

  const onValue = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(event.target.value);
  return { ref: undefined, name, onBlur, onChange: onValue };
}
