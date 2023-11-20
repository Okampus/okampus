import clsx from 'clsx';

export type SidepanelButtonProps = { className: string; children: React.ReactNode };
export function SidepanelButton({ className, children }: SidepanelButtonProps) {
  return (
    <button
      className={clsx(className, 'text-[var(--text-3)] hover:text-[var(--text-0)]')}
      onClick={() => document.querySelector('#sidepanel')?.classList.toggle('active')}
    >
      {children}
    </button>
  );
}
