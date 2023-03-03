import { TextItemSection } from '@okampus/ui/atoms';
import { clsx } from 'clsx';

import type { TextItemSectionProps } from '@okampus/ui/atoms';

export type MultiSectionProps = {
  sections: TextItemSectionProps[];
  className?: string;
};

export function MultiSection({ sections, className }: MultiSectionProps) {
  return (
    <div className={clsx('flex flex-col divide-y divide-color-3 [&>*]:py-8', className)}>
      {sections.map((section, idx) => (
        <TextItemSection {...section} key={idx} className="first:pt-0" />
      ))}
    </div>
  );
}
