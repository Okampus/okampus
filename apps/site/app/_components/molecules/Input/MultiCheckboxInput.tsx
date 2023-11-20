import Field from './Field';
import clsx from 'clsx';
import { memo, forwardRef, useRef, useEffect } from 'react';
import { mergeRefs } from 'react-merge-refs';
import type { UncontrolledInput } from '@okampus/shared/types';

export type SwitchInputProps = UncontrolledInput<boolean> & {
  wrapperClassName?: string;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'defaultValue' | 'className' | 'placeholder' | 'type'>;

export default memo(
  forwardRef<HTMLInputElement, SwitchInputProps>(function TextInput(props, ref) {
    const localRef = useRef<HTMLInputElement>();

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

    return (
      <Field {...{ label, className, name, description, required, error, info, loading }} horizontal={true}>
        <span className={clsx(wrapperClassName, '[&>input:checked]:bg-[var(--success)] bg-2')}>
          {input}
          <span className="absolute inset-y-[3px] aspect-square rounded-full bg-white peer-checked:right-[3px] left-[3px]" />
        </span>
      </Field>
    );
  }),
);

// import { Check } from '@phosphor-icons/react/dist/ssr';
// import type { SelectItem } from '@okampus/shared/types';

// export type MultiCheckboxInputProps<T> = {
//   items: SelectItem<T>[];
//   selected: boolean[];
//   onChange: (value: boolean[]) => void;
//   options: InputOptions;
// };

// export default function MultiCheckboxInput<T>({ items, selected, onChange, options }: MultiCheckboxInputProps<T>) {
//   const checkboxGroup = (
//     <div className="flex flex-col gap-3 px-1.5">
//       {items.map((item, idx) => {
//         const name = `${options.name}-${idx}`;
//         return (
//           <label key={idx} htmlFor={name} className="flex items-center gap-3 text-1 font-medium text-lg cursor-pointer">
//             <div className="relative w-7 h-7 rounded shrink-0">
//               <input
//                 id={name}
//                 name={name}
//                 type="checkbox"
//                 checked={selected[idx]}
//                 onChange={() =>
//                   onChange(
//                     selected.length === items.length
//                       ? selected.map((checked, idx) => (idx === idx ? !checked : checked))
//                       : items.map((_, idx) => idx === idx)
//                   )
//                 }
//                 className="absolute top-0 left-0 w-full h-full opacity-0"
//               />
//               <div className="absolute inset-0 bg-2 border border-[var(--border-1)] rounded">
//                 {selected[idx] && <Check className="absolute inset-0 bg-[var(--bg-opposite)] text-[var(--text-opposite)] rounded-sm" />}
//               </div>
//             </div>
//             {item.label}
//           </label>
//         );
//       })}
//     </div>
//   );

//   return options.label ? (
//     <fieldset className="border border-[var(--border-2)] px-3 py-2.5 rounded">
//       <legend className="text-1 opacity-90 text-lg font-medium px-1">
//         {options.label} {options.required && <div className="text-red-500">*</div>}
//       </legend>
//       {checkboxGroup}
//     </fieldset>
//   ) : (
//     checkboxGroup
//   );
// }
