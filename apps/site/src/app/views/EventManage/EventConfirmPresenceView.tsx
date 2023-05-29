import { EVENT_JOIN_ID_PARAM } from '@okampus/shared/consts';
import { AttendanceConfirmedVia } from '@okampus/shared/enums';
import { insertEventAttendanceMutation } from '@okampus/shared/graphql';
import { useMutation } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

export function EventConfirmPresenceView() {
  const eventJoinId = useParams()[EVENT_JOIN_ID_PARAM];

  const [insertEventAttendance, { loading, error }] = useMutation(insertEventAttendanceMutation);
  useEffect(() => {
    const insert = { eventJoinId, participated: true, confirmedVia: AttendanceConfirmedVia.QR };
    insertEventAttendance({ variables: { insert } });
  }, [eventJoinId, insertEventAttendance]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center">
      <div className="text-0 bg-2 p-8 mb-40 rounded-lg">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-3xl font-bold">Confirmation de présence</div>
            <div className="text-xl">Veuillez patienter...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-3xl font-bold">Confirmation de présence</div>
            <div className="text-xl">Une erreur est survenue</div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-3xl font-bold">Confirmation de présence</div>
            <div className="text-xl">La présence a bien été confirmée !</div>
          </div>
        )}
      </div>
    </div>
  );
}
