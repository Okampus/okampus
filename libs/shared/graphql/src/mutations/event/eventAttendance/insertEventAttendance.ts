import { $ } from '../../../zeus';
import { entityBase } from '../../../selectors/entityBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { eventAttendanceBaseInfo } from '../../../selectors/event/eventAttendance/eventAttendance';

import type { ValueTypes } from '../../../zeus';

// @ts-expect-error - Zeus depth limit
export const insertEventAttendanceMutation = typedGql('mutation')({
  insertEventAttendanceOne: [
    { object: $('insert', 'EventAttendanceInsertInput!') as ValueTypes['EventAttendanceInsertInput'] },
    {
      ...eventAttendanceBaseInfo,
      eventJoin: {
        ...entityBase,
        eventAttendances: [{}, eventAttendanceBaseInfo],
      },
    },
  ],
});
