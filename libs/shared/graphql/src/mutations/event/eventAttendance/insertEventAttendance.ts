import { $ } from '../../../zeus';
import { entityBase } from '../../../selectors/entityBase';
import { typedGql } from '../../../zeus/typedDocumentNode';
import { eventAttendanceBaseInfo } from '../../../selectors/event/eventAttendance/eventAttendance';

import type { ValueTypes } from '../../../zeus';

export const insertEventAttendanceMutation = typedGql('mutation')({
  insertEventAttendanceOne: [
    { object: $('object', 'EventAttendanceInsertInput!') as ValueTypes['EventAttendanceInsertInput'] },
    {
      ...eventAttendanceBaseInfo,
      eventJoin: {
        ...entityBase,
        eventAttendances: [{}, eventAttendanceBaseInfo],
      },
    },
  ],
});
