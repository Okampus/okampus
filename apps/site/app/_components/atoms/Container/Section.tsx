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
  horizontal: 'md-max:px-4',
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
        'flex flex-col gap-5',
        border && 'border-t border-[var(--border-1)]',
        paddingModes[paddingMode],
        className,
      )}
    >
      <div className="flex justify-between items-center">
        {title && (
          <h2 className={clsx('text-lg text-1 font-semibold', mobilePaddingModes[mobilePaddingMode])}>{title}</h2>
        )}
        {link && <Badge action={link}>{link.label}</Badge>}
      </div>
      {children}
    </section>
  );
}
