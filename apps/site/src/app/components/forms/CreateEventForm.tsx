import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@apollo/client';
import { createEventMutation } from '@okampus/shared/graphql';
import { Address, ITenantEvent } from '@okampus/shared/dtos';
import { EventState } from '@okampus/shared/enums';
import { useContext } from 'react';
import { NavigationContext } from '../../context/NavigationContext';
import { Avatar, SelectInput } from '@okampus/ui/atoms';

type CreateEventForm = {
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
  onSubmit: (data?: ITenantEvent) => void;
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
  const { user } = useContext(NavigationContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateEventForm>({
    resolver: zodResolver(schema),
  });

  const [createEvent, { error }] = useMutation(createEventMutation, {
    onCompleted: (data) => {
      onSubmit(data);
      // setIsLoading(true);
      // setTimeout(() => setIsLoading(false), 1000);
      // console.log(data);
      // if (user !== data.login.id) {
      //   setUser(data.login.id);
      // }
      // navigate('/');
    },
    onError: () => {
      // setIsLoading(false);
    },
  });

  const onCreateEvent = (event: CreateEventForm) => {
    createEvent({
      variables: { event: { ...event, orgId: '1674225760795109706', location, state: EventState.Submitted } },
    });
  };

  return (
    <form onSubmit={handleSubmit(onCreateEvent)}>
      <div className="flex flex-col gap-4 mb-6">
        {/* {JSON.stringify(errors)} */}
        {/* {JSON.stringify(getValues())} */}
        <div>
          <input
            type="text"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
            placeholder="Nom de l'événement"
            {...register('title')}
          />
          {errors.title?.message && <p className="pt-1 text-red-400 text-sm">{errors.title?.message}</p>}
        </div>

        <div className="w-full rounded-lg ">
          Superviseur
          <Controller
            {...register('supervisorId')}
            control={control}
            render={({ field: { onChange } }) => (
              <SelectInput
                onChange={onChange}
                options={[
                  {
                    value: user ?? '',
                    render: () => (
                      <div className="flex gap-2 items-center">
                        <Avatar size={3} name={'Ivan STEPANIAN'} />
                        <div>{'Ivan STEPANIAN'}</div>
                      </div>
                    ),
                  },
                  {
                    value: 'no',
                    render: () => (
                      <div className="flex gap-2 items-center">
                        <Avatar size={3} name={'Junior DJOMO'} />
                        <div>{'Junior DJOMO'}</div>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          />
          {errors.supervisorId?.message && <p className="pt-1 text-red-400 text-sm">{errors.supervisorId?.message}</p>}
          {/* <input
            type="text"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
            placeholder="Nom de l'événement"
            {...register('name')}
          />
          {errors.name?.message && <p className="pt-1 text-red-400 text-sm">{errors.name?.message}</p>} */}
        </div>

        <div>
          Date
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
            placeholder="Date et heure de début"
            {...register('start')}
          />
          {errors.start?.message && <p className="pt-1 text-red-400 text-sm">{errors.start?.message}</p>}
        </div>

        <div>
          <input
            type="datetime-local"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
            placeholder="Date et heure de fin"
            {...register('end')}
          />
          {errors.end?.message && <p className="pt-1 text-red-400 text-sm">{errors.end?.message}</p>}
        </div>

        <div>
          Addresse
          <input
            type="text"
            disabled
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
            value="Efrei République, 30-32 Avenue de la République, 94800 VILLEJUIF"
          />
          {/* {errors.end?.message && <p className="pt-1 text-red-400 text-sm">{errors.end?.message}</p>} */}
        </div>

        <div>
          <div className="flex gap-2">
            <input type="checkbox" placeholder="Événement privé ?" {...register('private')} />
            <label htmlFor="private">Événement privé ?</label>
          </div>
          {errors.private?.message && <p className="pt-1 text-red-400 text-sm">{errors.private?.message}</p>}
        </div>

        <div>
          <textarea
            rows={4}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black"
            placeholder="Description de l'événement"
            {...register('description')}
          />
          {(error || errors.description?.message) && (
            <p className="pt-1 text-red-400 text-sm">{error?.toString?.() ?? errors.description?.message}</p>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="submit"
          value="Créer l'événement"
          className={
            'hover:cursor-pointer rounded-lg bg-opposite text-opposite py-2 px-3 text-sm font-semibold text-white'
          }
        />
      </div>
      {/* <div className="break-all">{JSON.stringify(getValues())}</div> */}
      {/* <div>{JSON.stringify(errors.description)}</div> */}
    </form>
  );
}
