import { z } from 'zod';
import { useMutation, useQuery } from '@apollo/client';
import {
  createEventMutation,
  eventFragment,
  EventInfoFragment,
  getFragmentData,
  getTeamWithMembersQuery,
  teamMembersFragment,
} from '@okampus/shared/graphql';
import { Address } from '@okampus/shared/dtos';
import { EventState } from '@okampus/shared/enums';
import { DynamicFieldData, DynamicForm } from '@okampus/ui/organisms';
import { SelectItem } from '@okampus/ui/molecules';
import { useCurrentContext } from '@okampus/ui/hooks';

type CreateEventFormData = {
  title: string;
  start: Date;
  end: Date;
  supervisorId: string;
  description: string;
  // location: string;
  private: boolean;
};

const schema = z
  .object({
    title: z.string().min(3, { message: "Le nom de l'événement doit faire au moins 3 caractères." }),
    start: z.string().refine((date) => new Date(Date.parse(date)) > new Date(), {
      message: "La date de début d'événement doit être dans le futur.",
      path: ['start'],
    }),
    end: z.string().refine((date) => new Date(Date.parse(date)) > new Date(), {
      message: "La date de début d'événement doit être dans le futur.",
      path: ['start'],
    }),
    // price: z.number().min(0, { message: 'Le prix de l\'événement doit être positif.' }).refine;
    description: z.string().min(10, { message: "Une description d'événement est nécessaire." }),
    supervisorId: z.string(),
    // location: string,
    private: z.boolean(),
  })
  .refine((data) => data.start < data.end, {
    message: "La date de fin d'événement doit être après la date de début.",
    path: ['end'],
  });

type CreateEventFormProps = {
  onSubmit: (data?: EventInfoFragment) => void;
};

const location: Address = {
  name: 'Efrei République',
  city: 'Villejuif',
  country: 'France',
  street: '30-32 Avenue de la République',
  state: 'IDF',
  zip: 94_800,
  latitude: 48.7949,
  longitude: 2.3849,
};

export function CreateEventForm({ onSubmit }: CreateEventFormProps) {
  const [{ org }] = useCurrentContext();

  const { loading, error: queryErrors, data } = useQuery(getTeamWithMembersQuery, { variables: org });

  const [createEvent] = useMutation(createEventMutation, {
    onCompleted: (data) => {
      const event = getFragmentData(eventFragment, data.createEvent);
      onSubmit(event);
    },
    onError: () => {
      // setIsLoading(false);
    },
  });

  if (!org) return <p className="text-blue-500">Aucune organisation n'est chargée.</p>;

  const onCreateEvent = (event: CreateEventFormData) => {
    createEvent({
      variables: { event: { ...event, orgId: org.id, location, state: EventState.Submitted } },
    });
  };

  if (queryErrors) return <p className="text-blue-500">Une erreur est survenue.</p>;
  if (loading) return <p className="text-blue-500">Chargement...</p>;

  let members: SelectItem<string>[] = [];
  if (data) {
    members = getFragmentData(teamMembersFragment, data.teamById).members.map((member) => ({
      value: member.id,
      element: `${member.user?.actor?.name}`,
    }));
  }

  // .members.map((member) => ({
  //   value: member.id,
  //   element: `${member.user?.actor?.name}`,
  // }));

  const fields: DynamicFieldData[] = [
    {
      fieldName: 'title',
      inputType: 'text',
      label: "Nom de l'événement",
      defaultValue: '',
      placeholder: "Nom de l'événement",
    },
    {
      fieldName: 'supervisorId',
      inputType: 'select',
      label: 'Superviseur',
      options: members,
      fullWidth: true,
      placeholder: 'Superviseur',
    },
    {
      fieldName: 'start',
      inputType: 'datetime-local',
      label: "Début de l'événement",
      placeholder: 'Date et heure de début',
    },
    {
      fieldName: 'end',
      inputType: 'datetime-local',
      label: "Fin de l'événement",
      placeholder: 'Date et heure de fin',
    },
    {
      fieldName: 'private',
      inputType: 'checkbox',
      label: 'Événement privé ?',
    },
    {
      fieldName: 'description',
      inputType: 'text',
      label: 'Description',
      placeholder: 'Description',
    },
  ];

  return (
    <DynamicForm onSubmit={onCreateEvent} fields={fields} />
    // <form onSubmit={handleSubmit(onCreateEvent)}>
    //   <div className="flex flex-col gap-4 mb-6">
    //     {/* {JSON.stringify(errors)} */}
    //     {/* {JSON.stringify(getValues())} */}
    //     <div>
    //       <input
    //         type="text"
    //         className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
    //         placeholder="Nom de l'événement"
    //         {...register('title')}
    //       />
    //       {errors.title?.message && <p className="pt-1 text-red-400 text-sm">{errors.title?.message}</p>}
    //     </div>

    //     <div className="w-full rounded-lg ">
    //       Superviseur
    //       <Controller
    //         {...register('supervisorId')}
    //         control={control}
    //         render={({ field: { onChange } }) => (
    //           <SelectInput
    //             onChange={onChange}
    //             options={[]} // TODO: TeamMembers
    //           />
    //         )}
    //       />
    //       {errors.supervisorId?.message && <p className="pt-1 text-red-400 text-sm">{errors.supervisorId?.message}</p>}
    //       {/* <input
    //         type="text"
    //         className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
    //         placeholder="Nom de l'événement"
    //         {...register('name')}
    //       />
    //       {errors.name?.message && <p className="pt-1 text-red-400 text-sm">{errors.name?.message}</p>} */}
    //     </div>

    //     <div>
    //       Date
    //       <input
    //         type="datetime-local"
    //         className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
    //         placeholder="Date et heure de début"
    //         {...register('start')}
    //       />
    //       {errors.start?.message && <p className="pt-1 text-red-400 text-sm">{errors.start?.message}</p>}
    //     </div>

    //     <div>
    //       <input
    //         type="datetime-local"
    //         className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
    //         placeholder="Date et heure de fin"
    //         {...register('end')}
    //       />
    //       {errors.end?.message && <p className="pt-1 text-red-400 text-sm">{errors.end?.message}</p>}
    //     </div>

    //     <div>
    //       Addresse
    //       <input
    //         type="text"
    //         disabled
    //         className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
    //         value="Efrei République, 30-32 Avenue de la République, 94800 VILLEJUIF"
    //       />
    //       {/* {errors.end?.message && <p className="pt-1 text-red-400 text-sm">{errors.end?.message}</p>} */}
    //     </div>

    //     <div>
    //       <div className="flex gap-2">
    //         <input type="checkbox" placeholder="Événement privé ?" {...register('private')} />
    //         <label htmlFor="private">Événement privé ?</label>
    //       </div>
    //       {errors.private?.message && <p className="pt-1 text-red-400 text-sm">{errors.private?.message}</p>}
    //     </div>

    //     <div>
    //       <textarea
    //         rows={4}
    //         className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
    //         placeholder="Description de l'événement"
    //         {...register('description')}
    //       />
    //       {(error || errors.description?.message) && (
    //         <p className="pt-1 text-red-400 text-sm">{error?.toString?.() ?? errors.description?.message}</p>
    //       )}
    //     </div>
    //   </div>
    //   <div className="flex items-center">
    //     <input
    //       type="submit"
    //       value="Créer l'événement"
    //       className={
    //         'hover:cursor-pointer rounded-lg bg-opposite text-opposite py-2 px-3 text-sm font-semibold text-white'
    //       }
    //     />
    //   </div>
    //   {/* <div className="break-all">{JSON.stringify(getValues())}</div> */}
    //   {/* <div>{JSON.stringify(errors.description)}</div> */}
    // </form>
  );
}
