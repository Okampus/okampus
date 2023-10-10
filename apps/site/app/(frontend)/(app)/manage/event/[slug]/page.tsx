'use client';

import AvatarImage from '../../../../../_components/atoms/Image/AvatarImage';
import BannerImage from '../../../../../_components/atoms/Image/BannerImage';
import SimpleList from '../../../../../_components/molecules/List/SimpleList';
import ViewLayout from '../../../../../_components/atoms/Layout/ViewLayout';

import LocationForm, { locationSchema } from '../../../../../_components/forms/LocationForm';

import ChangeSetToast from '../../../../../_components/organisms/Form/ChangeSetToast';

import ActionButton from '../../../../../_components/molecules/Button/ActionButton';
import ImageCropperEditor from '../../../../../_components/molecules/ImageEditor/ImageCropperEditor';
import DateInput from '../../../../../_components/molecules/Input/Date/DateInput';
import FieldSet from '../../../../../_components/molecules/Input/FieldSet';
import SelectInput from '../../../../../_components/molecules/Input/Select/SelectInput';
import TextAreaInput from '../../../../../_components/molecules/Input/TextAreaInput';
import TextInput from '../../../../../_components/molecules/Input/TextInput';

import { notificationAtom } from '../../../../../_context/global';
import { useEventManage, useMe } from '../../../../../_context/navigation';
import { useModal } from '../../../../../_hooks/context/useModal';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { S3BucketNames, LocationType, EntityNames } from '@okampus/shared/enums';
import {
  useInsertAddressMutation,
  useUpdateEventMutation,
  useUpdateEventOrganizeProjectManyMutation,
  useUpdateLocationMutation,
} from '@okampus/shared/graphql';
import { ActionType, ToastType } from '@okampus/shared/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClockCounterClockwise } from '@phosphor-icons/react';
import { useAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import * as z from 'zod';

import type { LocationMinimalInfo } from '../../../../../../types/features/location.info';
import type { EventManageInfo } from '../../../../../../utils/apollo/fragments';

function ManageEventPageInner({ eventManage }: { eventManage: EventManageInfo }) {
  const eventUpdateSchema = z.object({
    description: z.string().max(10_000, { message: 'La description ne peut pas dépasser 10 000 caractères.' }),
    name: z
      .string({ required_error: "Nom de l'événement requis." })
      .min(3, { message: "Le nom de l'événement doit faire au moins 3 caractères." })
      .max(100, { message: "Le nom de l'événement ne peut pas dépasser 100 caractères." }),
    start: z.string({ required_error: 'Date de début requise.' }),
    end: z.string({ required_error: 'Date de fin requise.' }),
    projects: z.record(z.string(), z.string().nullable()).array(),
  });
  // .refine((data) => new Date(data.end) > new Date(data.start), {
  //   message: "La date et heure de fin de l'événement doit être après sa date et heure de début.",
  //   path: ['endDate'],
  // });

  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [, setNotification] = useAtom(notificationAtom);

  const defaultValues: z.infer<typeof eventUpdateSchema> = {
    name: eventManage.name,
    description: eventManage.description,
    start: eventManage.start.slice(0, 16),
    end: eventManage.end.slice(0, 16),
    projects: eventManage.eventOrganizes.map(({ team, project }) => ({ [team.id]: project?.id ?? null })),
  };

  const { openModal, closeModal, isModalOpen } = useModal();
  const me = useMe();

  const canManageTeams = eventManage?.eventOrganizes.filter(({ team }) =>
    me.teamMemberships.some(
      (teamMember) => teamMember.team.id === team.id && teamMember.teamMemberRoles.some(({ teamRole }) => teamRole),
    ),
  );

  const [insertAddress] = useInsertAddressMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [updateEventOrganizeProjectMany] = useUpdateEventOrganizeProjectManyMutation();
  const [updateLocation] = useUpdateLocationMutation();

  useEffect(() => {
    if (file && !isModalOpen) {
      openModal({
        node: (
          <ImageCropperEditor
            bucket={S3BucketNames.Banners}
            entityName={EntityNames.Event}
            src={URL.createObjectURL(file)}
            onUploaded={(fileUploadData) => {
              if (fileUploadData) {
                updateEvent({
                  variables: { id: eventManage.id, update: { bannerId: fileUploadData.fileUploadId } },
                  onCompleted: ({ updateEventByPk }) => {
                    if (updateEventByPk?.banner) closeModal();
                    else setNotification({ type: ToastType.Error, message: "Erreur lors de l'upload de l'image !" });
                  },
                });
              }
            }}
          />
        ),
      });
    }
  }, [closeModal, eventManage.id, file, isModalOpen, openModal, setNotification, updateEvent]);

  const { handleSubmit, register, formState, reset, control } = useForm({
    defaultValues,
    resolver: zodResolver(eventUpdateSchema),
  });

  const locationDefaultValues = {
    location: {
      name: eventManage.location.name,
      type: eventManage.location.type,
      address: eventManage.location.address,
      link: eventManage.location.link,
      details: eventManage.location.details,
    },
  };

  const locationForm = useForm<{ location: LocationMinimalInfo }>({
    defaultValues: locationDefaultValues,
    resolver: zodResolver(locationSchema),
  });

  const onSubmitLocation = (
    geoapifyId: string | null,
    location: {
      type: string;
      details: string;
      link: string;
      name: string;
    },
  ) => {
    updateLocation({
      variables: { id: eventManage.location.id, update: { geoapifyId, ...location } },
      onCompleted: () => locationForm.reset({}, { keepValues: true }),
    });
  };

  const onSubmit = handleSubmit((update) => {
    const { projects, start, end, description, name } = update;

    if (formState.isDirty) {
      updateEvent({
        variables: { id: eventManage.id, update: { name, description, end, start } },
        onCompleted: () => {
          updateEventOrganizeProjectMany({
            variables: {
              updates: Object.entries(projects).map(([teamId, projectId]) => ({
                where: { eventId: { _eq: eventManage.id }, teamId: { _eq: teamId } },
                update: { projectId },
              })),
            },
            onCompleted: () => reset({}, { keepValues: true }),
          });
        },
      });
    }

    if (locationForm.formState.isDirty && location) {
      const { address, ...locationData } = locationForm.getValues('location');

      // @ts-ignore
      if (address) delete address.__typename;

      if (locationData.type === LocationType.Online) {
        onSubmitLocation(null, locationData);
      } else if (locationData.type === LocationType.Unspecificed) {
        onSubmitLocation(null, { ...locationData, link: '', name: '' });
      } else {
        if (!address) onSubmitLocation(null, locationData);
        else if ('id' in address && typeof address.id === 'string') onSubmitLocation(address.id, locationData);
        else
          insertAddress({
            variables: { object: address },
            onCompleted: ({ insertAddressOne }) => onSubmitLocation(insertAddressOne?.geoapifyId ?? null, locationData),
          });

        onSubmitLocation(null, locationData);
      }
    }
  });

  return (
    <ViewLayout header={`Gérer : ${eventManage.name}`} sidePanelIcon={<ClockCounterClockwise className="h-7 w-7" />}>
      {eventManage && (
        <form onSubmit={onSubmit} className="grid lg-max:grid-cols-1 lg:grid-cols-[19.5rem_1fr] gap-x-12">
          <ChangeSetToast
            isDirty={formState.isDirty || locationForm.formState.isDirty}
            isValid={Object.entries(formState.errors).length === 0 && locationForm.formState.isValid}
            onCancel={() => {
              reset(defaultValues);
              locationForm.reset(locationDefaultValues);
            }}
          />
          <span className="flex flex-col gap-4">
            <SimpleList heading="Bannière">
              <span className="relative grow overflow-hidden" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
                <BannerImage className="rounded-xl" src={eventManage.banner?.url} />
              </span>
            </SimpleList>
            <div className="shrink-0 flex justify-between py-1.5 mb-2.5">
              <input
                ref={fileInputRef}
                type="file"
                className="absolute opacity-0 top-0 left-0 w-full h-full cursor-pointer z-0"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
              />
              <ActionButton
                action={{
                  type: ActionType.Primary,
                  label: 'Changer de bannière',
                  linkOrActionOrMenu: () => fileInputRef.current?.click(),
                }}
              />
              {eventManage.banner && (
                <ActionButton
                  action={{
                    label: 'Enlever',
                    linkOrActionOrMenu: () =>
                      updateEvent({ variables: { id: eventManage.id, update: { bannerId: null } } }),
                  }}
                />
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
                <AvatarImage actor={team.actor} type="team" size={52} className="mt-1" />
                <Controller
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
                />
              </div>
            ))}
          </span>
          <hr className="border-[var(--border-2)] my-10 col-[1/-1] hidden lg-max:block" />
          <div className="flex flex-col gap-4">
            <TextInput error={formState.errors.name?.message} label="Nom de l'événement" {...register('name')} />
            <FieldSet label="Où a lieu l'événement ?">
              <LocationForm formMethods={locationForm} />
            </FieldSet>
          </div>
          <hr className="border-[var(--border-2)] my-10 col-[1/-1]" />
          <TextAreaInput
            className="col-[1/-1]"
            error={formState.errors.description?.message}
            label="Description"
            rows={8}
            {...register('description')}
          />
        </form>
      )}
    </ViewLayout>
  );
}

export default function ManageEventPage({ params }: { params: { slug: string } }) {
  const { eventManage } = useEventManage(params.slug);

  if (!eventManage) return null;
  return <ManageEventPageInner eventManage={eventManage} />;
}
