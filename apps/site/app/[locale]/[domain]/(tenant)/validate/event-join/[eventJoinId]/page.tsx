'use client';

import { parseSnowflake } from '../../../../../../../utils/parse-snowflake';

import { ValidateEventJoin } from '../../../../../../_views/EventJoin/ValidateEventJoin';
import { useMemo } from 'react';

export default function ManageEventConfirmAttendancePage({ params }: { params: { eventJoinId: string } }) {
  const id = useMemo(() => parseSnowflake(params.eventJoinId), [params.eventJoinId]);

  if (!id) {
    return (
      <div>
        {/* // TODO: improve */}
        <div>ID invalide</div>
      </div>
    );
  }

  return <ValidateEventJoin id={id} />;
}
