import Badge from '../Badge/Badge';
import clsx from 'clsx';
import type { LinkActionProps } from '@okampus/shared/types';

export type SectionProps = {
  title?: string;
  link?: LinkActionProps;
  children: React.ReactNode;
  className?: string;
  paddingMode?: 'default' | 'none' | 'bottom';
  mobilePaddingMode?: 'default' | 'horizontal';
  border?: boolean;
};

const paddingModes = { default: 'py-10', bottom: 'pb-10', none: '' };

const mobilePaddingModes = {
  default: '',
  horizontal: 'md:px-6',
};

export default function Section({
  title,
  children,
  className,
  link,
  border,
  paddingMode = 'default',
  mobilePaddingMode = 'default',
}: SectionProps) {
  return (
    <section
      className={clsx(
        'flex flex-col gap-6',
        border && 'border-t border-[var(--border-1)]',
        paddingModes[paddingMode],
        mobilePaddingModes[mobilePaddingMode],
        className,
      )}
    >
      <div className="flex justify-between items-center">
        {title && <h2 className="text-xl text-0 font-semibold">{title}</h2>}
        {link && <Badge action={link}>{link.label}</Badge>}
      </div>
      {children}
    </section>
  );
}
