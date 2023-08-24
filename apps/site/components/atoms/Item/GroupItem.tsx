import GroupHeading from '../Heading/GroupHeading';
import clsx from 'clsx';

export type GroupItemProps = {
  className?: string;
  type?: 'menu' | 'page';
  groupClassName?: string;
  headingClassName?: string;
  heading: string;
  children: React.ReactNode;
};

export default function GroupItem({
  className,
  type = 'menu',
  groupClassName = 'flex flex-col gap-2',
  headingClassName,
  heading,
  children,
}: GroupItemProps) {
  return (
    <div className={clsx(className, 'grow min-w-0 flex flex-col gap-1.5')}>
      <GroupHeading type={type} label={heading} className={headingClassName} />
      {children && (
        <ul className={groupClassName}>
          {Array.isArray(children) ? children.filter(Boolean).map((elem, idx) => <li key={idx}>{elem}</li>) : children}
        </ul>
      )}
    </div>
  );
}
