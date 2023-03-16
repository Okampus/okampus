import { clsx } from 'clsx';
import { Link } from 'react-router-dom';

export type Action = {
  label: string;
  icon?: React.ReactNode;
  linkOrAction: string | (() => void);
  disabled?: boolean;
};

export type ActionListProps = {
  actions: Action[];
  className?: string;
};

const itemClass = 'flex gap-4 items-center w-full text-0 text-lg font-medium font-title px-4 py-3 bg-1-hover';
export function ActionList({ actions, className }: ActionListProps) {
  return (
    <ul className={clsx('flex flex-col', className)}>
      {actions.map((action, idx) => (
        <li key={idx}>
          {typeof action.linkOrAction === 'string' ? (
            <Link to={action.linkOrAction} className={itemClass}>
              {action.icon}
              <span>{action.label}</span>
            </Link>
          ) : (
            <button onClick={action.linkOrAction} className={itemClass}>
              {action.icon}
              <span>{action.label}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
