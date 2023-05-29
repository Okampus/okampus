import { BANNER_ASPECT_RATIO, EVENT_MANAGE_ROUTE } from '@okampus/shared/consts';
import { ActionButton } from '@okampus/ui/molecules';
import { DarkGradient, BannerImage } from '@okampus/ui/atoms';
import type { EventDetailsInfo } from '@okampus/shared/graphql';

export type EventSidePanelProps = { event: EventDetailsInfo };
export function EventSidePanel({ event }: EventSidePanelProps) {
  const banner = event.fileUpload?.url;
  return (
    <div className="h-full flex flex-col items-center mb-10">
      <div className="w-full relative" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
        <DarkGradient>
          <BannerImage aspectRatio={BANNER_ASPECT_RATIO} src={banner} name={event.contentMaster?.name} />
          <div className="absolute top-4 px-6 font-semibold italic z-20 text-white text-lg">Événement</div>
        </DarkGradient>
        <div className="absolute bottom-4 px-5 text-4xl font-bold text-white">{event.contentMaster?.name}</div>
      </div>
      <div className="p-4 w-full">
        <ActionButton
          action={{
            label: 'Gérer',
            linkOrActionOrMenu: EVENT_MANAGE_ROUTE(event.contentMaster?.slug),
          }}
        />
      </div>
    </div>
  );
}
