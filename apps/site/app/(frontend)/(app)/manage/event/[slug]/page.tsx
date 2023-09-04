'use client';

import AvatarImage from '../../../../../../components/atoms/Image/AvatarImage';
import BannerImage from '../../../../../../components/atoms/Image/BannerImage';
import GroupItem from '../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';

import LocationForm, { locationSchema } from '../../../../../../components/forms/LocationForm';

import ChangeSetToast from '../../../../../../components/organisms/Form/ChangeSetToast';

import ActionButton from '../../../../../../components/molecules/Button/ActionButton';
import ImageEditorForm from '../../../../../../components/molecules/ImageEditor/ImageEditorForm';
import DateInput from '../../../../../../components/molecules/Input/Date/DateInput';
import FieldSet from '../../../../../../components/molecules/Input/FieldSet';
import SelectInput from '../../../../../../components/molecules/Input/Select/SelectInput';
import TextAreaInput from '../../../../../../components/molecules/Input/TextAreaInput';
import TextInput from '../../../../../../components/molecules/Input/TextInput';

import { useEventManage, useMe } from '../../../../../../context/navigation';
import { useModal } from '../../../../../../hooks/context/useModal';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { BucketNames, EntityName, LocationType, TeamPermissions } from '@okampus/shared/enums';
import {
  useInsertAddressMutation,
  useUpdateEventMutation,
  useUpdateEventOrganizeProjectManyMutation,
  useUpdateLocationMutation,
} from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconHistory } from '@tabler/icons-react';
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

  const defaultValues: z.infer<typeof eventUpdateSchema> = {
    name: eventManage.name,
    description: eventManage.description,
    start: eventManage.start.slice(0, 16),
    end: eventManage.end.slice(0, 16),
    projects: eventManage.eventOrganizes.map(({ team, project }) => ({ [team.id]: project?.id ?? null })),
  };

  const { openModal, closeModal } = useModal();
  const me = useMe();

  const canManageTeams = eventManage?.eventOrganizes.filter(
    ({ team }) =>
      me.canManageTenant ??
      me.user.teamMemberships.some(
        (teamMember) =>
          teamMember.team.id === team.id &&
          teamMember.teamMemberRoles.some(
            ({ teamRole }) => teamRole.permissions?.includes(TeamPermissions.ManageEvents.toString()),
          ),
      ),
  );

  const [insertAddress] = useInsertAddressMutation();
  const [updateEvent] = useUpdateEventMutation();
  const [updateEventOrganizeProjectMany] = useUpdateEventOrganizeProjectManyMutation();
  const [updateLocation] = useUpdateLocationMutation();

  const updateBanner = () =>
    openModal({
      node: (
        <ImageEditorForm
          uploadContext={{ bucket: BucketNames.Banners, entityName: EntityName.Event }}
          onUploaded={(fileId, onCompleted, onError) =>
            updateEvent({
              variables: { id: eventManage.id, update: { bannerId: fileId } },
              onCompleted: ({ updateEventByPk }) => {
                if (updateEventByPk?.banner) {
                  onCompleted();
                  closeModal();
                } else onError();
              },
            })
          }
        />
      ),
    });

  const { handleSubmit, register, formState, reset, control, watch } = useForm({
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
    addressId: string | null,
    location: {
      type: string;
      details: string;
      link: string;
      name: string;
    },
  ) => {
    updateLocation({
      variables: { id: eventManage.location.id, update: { addressId, ...location } },
      onCompleted: () => locationForm.reset({}, { keepValues: true }),
    });
  };

  const onSubmit = handleSubmit((update) => {
    const { projects, start, end, description, name } = update;

    if (formState.isDirty) {
      updateEvent({
        variables: { id: eventManage.id, update: { name, description, end, start } },
        onCompleted: () =>
          updateEventOrganizeProjectMany({
            variables: {
              updates: Object.entries(projects).map(([teamId, projectId]) => ({
                where: { eventId: { _eq: eventManage.id }, teamId: { _eq: teamId } },
                update: { projectId },
              })),
            },
            onCompleted: () => reset({}, { keepValues: true }),
          }),
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
            onCompleted: ({ insertAddressOne }) => onSubmitLocation(insertAddressOne?.id ?? null, locationData),
          });

        onSubmitLocation(null, locationData);
      }
    }
  });

  return (
    <ViewLayout header={`Gérer : ${eventManage.name}`} sidePanelIcon={<IconHistory />}>
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
            <GroupItem heading="Bannière">
              <span className="relative grow overflow-hidden" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
                <BannerImage className="rounded-xl" src={eventManage.banner?.url} />
                <div
                  onClick={updateBanner}
                  className="rounded-2xl p-5 absolute -inset-px opacity-0 hover:opacity-50 outline outline-black outline-1 z-20 cursor-pointer bg-black text-white flex gap-1 items-center justify-center"
                >
                  <div className="font-semibold text-center">Changer de bannière</div>
                </div>
              </span>
            </GroupItem>
            <div className="shrink-0 flex justify-between py-1.5 mb-2.5">
              <ActionButton
                action={{ label: 'Changer la bannière', linkOrActionOrMenu: updateBanner, type: ActionType.Primary }}
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
                      name={field.name}
                      value={field.value}
                      error={formState.errors.projects?.[idx]?.[team.id]?.message}
                      onChange={field.onChange}
                      options={team.projects.map((project) => ({ label: project.name, value: project.id }))}
                      label={`${team.actor.name} / Projet lié`}
                    />
                  )}
                />
              </div>
            ))}
          </span>
          <hr className="border-color-2 my-10 col-[1/-1] hidden lg-max:block" />
          <div className="flex flex-col gap-4">
            <TextInput error={formState.errors.name?.message} label="Nom de l'événement" {...register('name')} />
            <FieldSet label="Où a lieu l'événement ?">
              <LocationForm formMethods={locationForm} />
            </FieldSet>
          </div>
          <hr className="border-color-2 my-10 col-[1/-1]" />
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
