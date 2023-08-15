import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

export type AccordeonProps = {
  children: React.ReactNode;
  label: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
};
export default function Accordeon({ children, label, open, setOpen }: AccordeonProps) {
  return (
    <details open={open} className="cursor-pointer flex flex-col gap-2">
      <summary
        onClick={(event) => {
          event.preventDefault();
          setOpen(!(event.currentTarget.parentElement as HTMLDetailsElement).open);
        }}
        className="flex justify-between items-center px-3 py-2 min-h-[2rem] bg-2-hover"
      >
        {label}
        {open ? <IconChevronUp className="h-5 aspect-square" /> : <IconChevronDown className="h-5 aspect-square" />}
      </summary>
      <div className="px-2 py-1.5 bg-2">{children}</div>
    </details>
  );
}
