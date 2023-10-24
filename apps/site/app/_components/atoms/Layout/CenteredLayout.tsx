import clsx from 'clsx';

export type CenteredLayoutProps = {
  children: React.ReactNode;
  className?: string;
};
export default function CenteredLayout({ children, className }: CenteredLayoutProps) {
  return (
    <section className={clsx('w-full h-full flex flex-col items-center justify-center', className)}>
      <div className="relative flex flex-col overflow-y-auto scrollbar max-w-[35rem] mb-20 mr-20">{children}</div>
    </section>
  );
}
