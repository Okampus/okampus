import { EVENT_ROUTE } from '@okampus/shared/consts';
import { ActionButton } from '@okampus/ui/molecules';
import type { EventManageBaseInfo } from '@okampus/shared/graphql';

export type EventManageSidePanelProps = { event: EventManageBaseInfo };
export function EventManageSidePanel({ event }: EventManageSidePanelProps) {
  return (
    <div className="p-4 w-full">
      <ActionButton
        action={{
          label: 'Vue publique',
          linkOrActionOrMenu: EVENT_ROUTE(event?.slug),
        }}
      />
    </div>
  );
}
