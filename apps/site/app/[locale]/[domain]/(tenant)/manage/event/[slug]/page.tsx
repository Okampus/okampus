import AvatarImage from '../../../../../../_components/atoms/Image/AvatarImage';
import BannerImage from '../../../../../../_components/atoms/Image/BannerImage';
import BaseView from '../../../../../../_components/templates/BaseView';

// import LocationForm, { locationSchema } from '../../../../../../_views/Form/LocationForm';

// import ChangeSetToast from '../../../../../../_components/organisms/Form/ChangeSetToast';

import Button from '../../../../../../_components/molecules/Button/Button';
import DateInput from '../../../../../../_components/molecules/Input/Uncontrolled/Date/DateInput';
import FieldSet from '../../../../../../_components/molecules/Input/FieldSet';
// import SelectInput from '../../../../../../_components/molecules/Input/Select/SelectInput';
import TextAreaInput from '../../../../../../_components/molecules/Input/Uncontrolled/String/TextAreaInput';
import TextInput from '../../../../../../_components/molecules/Input/Uncontrolled/String/TextInput';

import { useModal } from '../../../../../../_hooks/context/useModal';

import prisma from '../../../../../../../database/prisma/db';
import { eventDetails, type EventDetails } from '../../../../../../../types/prisma/Event/event-details';
import { useMe } from '../../../../../../_hooks/context/useMe';
import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import {
  ActionType,
  // ToastType
} from '@okampus/shared/enums';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClockCounterClockwise } from '@phosphor-icons/react';
import // S3BucketNames,
// LocationType,
// EntityNames
'@prisma/client';
import { notFound } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// import type { LocationMinimal } from '../../../../../../../types/prisma/Location/location-minimal';
import type { DomainSlugParams } from '../../../../../../params.type';

// TODO: TEMP
function ManageEventPageInner({ eventManage }: { eventManage: EventDetails }) {
  const eventUpdateSchema = z.object({
    name: z
      .string({ required_error: "Nom de l'événement requis." })
      .min(3, { message: "Le nom de l'événement doit faire au moins 3 caractères." })
      .max(100, { message: "Le nom de l'événement ne peut pas dépasser 100 caractères." }),
    summary: z.string().max(10_000, { message: 'La description ne peut pas dépasser 10 000 caractères.' }),
    start: z.string({ required_error: 'Date de début requise.' }),
    end: z.string({ required_error: 'Date de fin requise.' }).optional(),
    projects: z.record(z.string(), z.bigint().nullable()).array(),
  });
  // .refine((data) => new Date(data.end) > new Date(data.start), {
  //   message: "La date et heure de fin de l'événement doit être après sa date et heure de début.",
  //   path: ['endDate'],
  // });

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const defaultValues: z.infer<typeof eventUpdateSchema> = {
    name: eventManage.name,
    summary: eventManage.summary,
    start: eventManage.start.toISOString().slice(0, 16),
    end: eventManage.end?.toISOString().slice(0, 16),
    projects: eventManage.eventOrganizes.map(({ team, project }) => ({ [team.id.toString()]: project?.id ?? null })),
  };

  const { openModal, closeModal, isModalOpen } = useModal();

  const { data: me } = useMe();
  const canManageTeams = eventManage?.eventOrganizes.filter(({ team }) =>
    me.teamMemberships.some(
      (teamMember) =>
        teamMember.team.id === team.id && teamMember.teamMemberRoles.some(({ teamRole }) => teamRole.canManageEvents),
    ),
  );

  // const [insertAddress] = useInsertAddressMutation();
  // const [updateEvent] = useUpdateEventMutation();
  // const [updateEventOrganizeProjectMany] = useUpdateEventOrganizeProjectManyMutation();
  // const [updateLocation] = useUpdateLocationMutation();

  const { handleSubmit, register, formState, reset, control } = useForm({
    defaultValues,
    resolver: zodResolver(eventUpdateSchema),
  });

  // const locationDefaultValues = {
  //   location: {
  //     name: eventManage.location?.name,
  //     type: eventManage.location?.type,
  //     address: eventManage.location?.address,
  //     link: eventManage.location?.link,
  //     details: eventManage.locationDetails,
  //   },
  // };

  // const locationForm = useForm<{ location: LocationMinimal }>({
  //   defaultValues: locationDefaultValues,
  //   resolver: zodResolver(locationSchema),
  // });

  // const onSubmitLocation = (
  //   geoapifyId: string | null,
  //   location: {
  //     type: string;
  //     link: string;
  //     name: string;
  //   },
  // ) => {
  //   // console.log(locationForm);
  //   // updateLocation({
  //   //   variables: { id: eventManage.location.id, update: { geoapifyId, ...location } },
  //   //   onCompleted: () => locationForm.reset({}, { keepValues: true }),
  //   // });
  // };

  const onSubmit = handleSubmit((update) => {
    const { projects, start, end, summary, name } = update;

    if (formState.isDirty) {
      // updateEvent({
      //   variables: { id: eventManage.id, update: { name, description, end, start } },
      //   onCompleted: () => {
      //     updateEventOrganizeProjectMany({
      //       variables: {
      //         updates: Object.entries(projects).map(([teamId, projectId]) => ({
      //           where: { eventId: { _eq: eventManage.id }, teamId: { _eq: teamId } },
      //           update: { projectId },
      //         })),
      //       },
      //       onCompleted: () => reset({}, { keepValues: true }),
      //     });
      //   },
      // });
    }

    // if (locationForm.formState.isDirty && location) {
    //   const { address, ...locationData } = locationForm.getValues('location');

    //   // @ts-ignore
    //   if (address) delete address.__typename;

    //   if (locationData.type === LocationType.Online) {
    //     onSubmitLocation(null, locationData);
    //   } else {
    //     if (!address) onSubmitLocation(null, locationData);
    //     else if ('id' in address && typeof address.id === 'string') onSubmitLocation(address.id, locationData);
    //     // TODO: mutate
    //     // else
    //     //   insertAddress({
    //     //     variables: { object: address },
    //     //     // onCompleted: ({ insertAddressOne }) => onSubmitLocation(insertAddressOne?.geoapifyId ?? null, locationData),
    //     //   });

    //     onSubmitLocation(null, locationData);
    //   }
    // }
  });

  return (
    <BaseView header={`Gérer : ${eventManage.name}`} sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}>
      {eventManage && (
        <form onSubmit={onSubmit} className="grid lg-max:grid-cols-1 lg:grid-cols-[19.5rem_1fr] gap-x-12">
          {/* <ChangeSetToast
            isDirty={formState.isDirty || locationForm.formState.isDirty}
            isValid={Object.entries(formState.errors).length === 0 && locationForm.formState.isValid}
            onCancel={() => {
              reset(defaultValues);
              locationForm.reset(locationDefaultValues);
            }}
          /> */}
          <span className="flex flex-col gap-4">
            <span className="relative grow overflow-hidden" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
              <BannerImage className="rounded-xl" src={eventManage.banner} />
            </span>
            <div className="shrink-0 flex justify-between py-1.5 mb-2.5">
              <input
                ref={fileInputRef}
                type="file"
                className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
              <Button type={ActionType.Primary} action={() => fileInputRef.current?.click()}>
                Changer de bannière
              </Button>
              {eventManage.banner && (
                <Button
                // action={{
                // updateEvent({ variables: { id: eventManage.id, update: { bannerId: null } } }),
                // }}
                >
                  Enlever
                </Button>
              )}
            </div>
            <DateInput
              error={formState.errors.start?.message}
              label="Début de l'événement"
              includeTime={true}
              {...register('start')}
            />
            <DateInput
              error={formState.errors.end?.message}
              label="Fin de l'événement"
              includeTime={true}
              {...register('end')}
            />
            {canManageTeams.map(({ team }, idx) => (
              <div key={team.id} className="flex gap-4 items-center">
                <AvatarImage actor={team.actor} size={52} className="mt-1" />
                {/* <Controller
                  control={control}
                  name={`projects.${idx}.${team.id}`}
                  render={({ field }) => (
                    <SelectInput
                      error={formState.errors.projects?.[idx]?.[team.id]?.message}
                      options={team.projects.map((project) => ({ label: project.name, value: project.id }))}
                      label={`${team.actor.name} / Projet lié`}
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={field.value}
                    />
                  )}
                /> */}
              </div>
            ))}
          </span>
          <hr className="border-[var(--border-2)] my-10 col-[1/-1] hidden lg-max:block" />
          <div className="flex flex-col gap-4">
            <TextInput name="name" error={formState.errors.name?.message} label="Nom de l'événement" />
            <FieldSet label="Où a lieu l'événement ?">{/* <LocationForm formMethods={locationForm} /> */}</FieldSet>
          </div>
          <hr className="border-[var(--border-2)] my-10 col-[1/-1]" />
          <TextAreaInput
            name="description"
            className="col-[1/-1]"
            error={formState.errors.summary?.message}
            label="Description"
            rows={8}
            // {...register('description')}
          />
        </form>
      )}
    </BaseView>
  );
}

export default async function ManageEventPage({ params }: DomainSlugParams) {
  // const { eventManage } = useEventManage(params.slug);
  // if (!eventManage) return null;
  const eventManage = await prisma.event.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: eventDetails.select,
  });

  if (!eventManage) notFound();

  return <ManageEventPageInner eventManage={eventManage} />;
}
