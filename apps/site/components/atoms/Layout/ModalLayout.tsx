import clsx from 'clsx';

export type ModalLayoutProps = {
  children: React.ReactNode;
  contentNoPadding?: boolean;
  contentClassName?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  className?: string;
};

export default function ModalLayout({
  children,
  contentNoPadding,
  contentClassName = 'flex flex-col items-center',
  footer,
  header,
  className = 'w-full',
}: ModalLayoutProps) {
  const sectionClass = clsx(className, 'flex flex-col flex-1 overflow-hidden');
  const contentClass = clsx(
    'min-h-0 overflow-y-scroll scrollbar text-1 font-medium',
    contentClassName,
    !contentNoPadding && 'px-7 pt-3 pb-8',
  );
  return (
    <section className={sectionClass}>
      {header && (
        <header className="shrink-0 min-h-[var(--topbar-height)] flex justify-center py-6 pl-16 pr-24 page-subtitle tracking-tighter">
          {header}
        </header>
      )}
      <main className={contentClass}>{children}</main>
      {footer && <footer className="md:tall:self-end shrink-0 min-h-[var(--topbar-height)] py-4 px-6">{footer}</footer>}
    </section>
  );
}
