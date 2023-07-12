// import { EventState } from '@okampus/shared/enums';
import { OrderBy, eventBaseInfo, useTypedQuery } from '@okampus/shared/graphql';
import { Calendar } from '@okampus/ui/organisms';
import { useState } from 'react';

export function EventList() {
  const [monthYear, setMonthYear] = useState<[number, number]>([new Date().getMonth(), new Date().getFullYear()]);

  const _gte = new Date(monthYear[1], monthYear[0], 1).toISOString();
  const _lte = new Date(monthYear[1], monthYear[0] + 1, 0).toISOString();

  const { data } = useTypedQuery({
    event: [
      {
        where: {
          start: { _gte, _lte },
          // state: { _eq: EventState.Published }
        },
        orderBy: [{ start: OrderBy.ASC }],
      },
      eventBaseInfo,
    ],
  });

  return <Calendar showInTopbar={true} events={data?.event || []} monthYear={monthYear} setMonthYear={setMonthYear} />;
}
