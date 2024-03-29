import { CaretUp, CaretDown } from '@phosphor-icons/react/dist/ssr';
import clsx from 'clsx';

export type AccordeonProps = {
  children: React.ReactNode;
  label: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  titleClassName?: string;
};
export default function Accordeon({ children, label, open, setOpen, titleClassName }: AccordeonProps) {
  return (
    <details open={open} className="cursor-pointer flex flex-col gap-2">
      <summary
        onClick={(event) => {
          event.preventDefault();
          setOpen(!(event.currentTarget.parentElement as HTMLDetailsElement).open);
        }}
        className={clsx(titleClassName, 'flex justify-between items-center px-3 py-2 min-h-[2rem] bg-2-hover')}
      >
        {label}
        {open ? <CaretUp className="h-5 aspect-square" /> : <CaretDown className="h-5 aspect-square" />}
      </summary>
      <div className="px-2 py-1.5">{children}</div>
    </details>
  );
}
