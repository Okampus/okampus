export type ListProps = {
  className?: string;
  groupClassName?: string;
  heading: React.ReactNode;
  children: React.ReactNode;
};

export default function List({ className = 'flex flex-col gap-4', groupClassName, heading, children }: ListProps) {
  return (
    <div className={className}>
      {heading}
      <div className={groupClassName}>{children}</div>
    </div>
  );
}
