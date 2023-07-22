import GroupHeading from '../../atoms/Heading/GroupHeading';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';

import type { GroupHeadingProps } from '../../atoms/Heading/GroupHeading';

export type CollapseInputProps = {
  heading: Omit<GroupHeadingProps, 'icon'>;
  open: boolean;
  setOpen: (open: boolean) => void;
};
export default function CollapseInput({ heading: { label }, open, setOpen }: CollapseInputProps) {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="flex items-center justify-between px-3 py-2.5 min-h-[2rem] bg-2-hover rounded"
    >
      <GroupHeading label={label} />
      {open ? <IconChevronUp className="h-5 aspect-square" /> : <IconChevronDown className="h-5 aspect-square" />}
    </button>
  );
}
