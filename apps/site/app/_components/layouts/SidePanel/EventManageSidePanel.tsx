import Sidepanel from '../Sidepanel';
import LogHistory from '../../molecules/Log/LogHistory';
import prisma from '../../../../database/prisma/db';

import { logMinimal } from '../../../../types/prisma/Log/log-minimal';

export type EventManageSidePanelProps = { id: bigint };
export default async function EventManageSidePanel({ id }: EventManageSidePanelProps) {
  const logs = await prisma.log.findMany({
    where: { eventId: id },
    select: logMinimal.select,
  });

  return (
    <Sidepanel>
      {/*       < heading="Historique" className="mt-[var(--py-content)] px-4" headingClassName="pb-4 px-2"> */}
      <LogHistory logs={logs} />
      {/*       </> */}
    </Sidepanel>
  );
}
