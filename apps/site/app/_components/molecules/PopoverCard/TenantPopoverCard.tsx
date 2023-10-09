import PopoverCard from './PopoverCard';

import SimpleList from '../List/SimpleList';
import Popover from '../../atoms/Popup/Popover/Popover';
import PopoverTrigger from '../../atoms/Popup/Popover/PopoverTrigger';
import PopoverContent from '../../atoms/Popup/Popover/PopoverContent';

import Skeleton from '../../atoms/Skeleton/Skeleton';

import { useTranslation } from '../../../_hooks/context/useTranslation';

import { useTenant } from '../../../_context/navigation';

import { ReactComponent as OkampusLogo } from '@okampus/assets/svg/brands/okampus.svg';

export type TenantPopoverCardProps = { triggerClassName?: string; children: React.ReactNode };
export default function TenantPopoverCard({ triggerClassName, children }: TenantPopoverCardProps) {
  const { format } = useTranslation();
  const { tenant } = useTenant();

  return (
    <Popover forcePlacement={true} crossAxis={false} placementOffset={16} placement="right-start">
      <PopoverTrigger className={triggerClassName}>{children}</PopoverTrigger>
      <PopoverContent popoverClassName="rounded-2xl bg-0">
        {tenant ? (
          <PopoverCard
            avatar={tenant.actor.avatar}
            banner={tenant.actor.banner}
            name={tenant.actor.name}
            link="/tenant"
            type="team"
          >
            {tenant.actor.bio && (
              <>
                <div className="text-1 line-clamp-6 font-medium">{tenant.actor.bio}</div>
                <hr className="my-4 border-color-3" />
              </>
            )}
            <SimpleList heading="Actif depuis">
              <div className="flex items-center gap-1.5">
                <OkampusLogo className="h-4 w-4" />
                <div className="font-medium text-sm capitalize">{format('weekDay', new Date(tenant.createdAt))}</div>
              </div>
            </SimpleList>
          </PopoverCard>
        ) : (
          <div className="flex flex-col w-80 rounded-lg overflow-hidden">
            <div className="h-24 bg-0" />
            <div className="bg-1 text-0 p-4 relative flex flex-col gap-1">
              <Skeleton className="absolute -translate-y-[50%] rounded-[50%] h-14 w-14 border-4 border-[var(--bg-1)]" />
              <Skeleton className="-mt-4 h-6 w-64" />
              <hr className="my-1 border-color-3" />
              <Skeleton className="w-32 h-3" />
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}