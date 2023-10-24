import GroupHeading from '../../atoms/Heading/GroupHeading';
import clsx from 'clsx';

export type SimpleListProps = {
  className?: string;
  type?: 'menu' | 'page';
  groupClassName?: string;
  headingClassName?: string;
  heading: string;
  children: React.ReactNode;
};

export default function SimpleList({
  className,
  type = 'menu',
  groupClassName = 'flex flex-col gap-2',
  headingClassName,
  heading,
  children,
}: SimpleListProps) {
  return (
    <div className={clsx(className, 'grow min-w-0 flex flex-col gap-1.5')}>
      <GroupHeading type={type} label={heading} className={headingClassName} />
      {children && (
        <ul className={groupClassName}>
          {Array.isArray(children)
            ? children.filter(Boolean).map((element, idx) => <li key={idx}>{element}</li>)
            : children}
        </ul>
      )}
    </div>
  );
}
