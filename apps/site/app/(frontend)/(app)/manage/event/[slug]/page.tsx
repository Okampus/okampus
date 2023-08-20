'use client';

import AvatarImage from '../../../../../../components/atoms/Image/AvatarImage';
import BannerImage from '../../../../../../components/atoms/Image/BannerImage';
import GroupItem from '../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';

import ActionButton from '../../../../../../components/molecules/Button/ActionButton';
import ChangeSetToast from '../../../../../../components/organisms/Form/ChangeSetToast';
import ImageEditorForm from '../../../../../../components/molecules/ImageEditor/ImageEditorForm';
import DateInput from '../../../../../../components/molecules/Input/Date/DateInput';
import SelectInput from '../../../../../../components/molecules/Input/Select/SelectInput';
import TextAreaInput from '../../../../../../components/molecules/Input/TextAreaInput';
import TextInput from '../../../../../../components/molecules/Input/TextInput';

import { useEventManage, useMe } from '../../../../../../context/navigation';
import { useModal } from '../../../../../../hooks/context/useModal';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { Buckets, EntityName, TeamPermissions } from '@okampus/shared/enums';
import { useUpdateEventMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import * as z from 'zod';

import type { EventManageInfo } from '../../../../../../context/navigation';
import type { LocationMinimalInfo } from '../../../../../../types/features/location.info';

function ManageEventPageInner({ eventManage }: { eventManage: EventManageInfo }) {
  const eventUpdateSchema = z
    .object({
      description: z.string().max(10_000, { message: 'La description ne peut pas dépasser 10 000 caractères.' }),
      name: z
        .string({ required_error: "Nom de l'événement requis." })
        .min(3, { message: "Le nom de l'événement doit faire au moins 3 caractères." })
        .max(100, { message: "Le nom de l'événement ne peut pas dépasser 100 caractères." }),
      start: z
        .date({ required_error: 'Date de début requise.' })
        .min(new Date(), { message: "L'événement ne peut pas commencer dans le passé." }),
      end: z.date({ required_error: 'Date de fin requise.' }),
      location: z.any().nullable() as z.ZodType<LocationMinimalInfo | null>,
      projects: z.record(z.string(), z.string().nullable()).array(),
    })
    .refine((data) => data.end > data.start, {
      message: "La date et heure de fin de l'événement doit être après sa date et heure de début.",
      path: ['endDate'],
    });

  const defaultValues: z.infer<typeof eventUpdateSchema> = {
    name: eventManage.name,
    description: eventManage.description,
    start: new Date(eventManage.start),
    end: new Date(eventManage.end),
    location: eventManage.location ?? null,
    projects: eventManage.eventOrganizes.map(({ team, project }) => ({ [team.id]: project?.id ?? null })),
  };

  const { openModal, closeModal } = useModal();
  const me = useMe();

  const canManageTeams = eventManage?.eventOrganizes.filter(
    ({ team }) =>
      me.canManageTenant ??
      me.user.teamMembers.some(
        (teamMember) =>
          teamMember.team.id === team.id &&
          teamMember.teamMemberRoles.some(
            ({ role }) => role.permissions?.includes(TeamPermissions.ManageEvents.toString()),
          ),
      ),
  );

  const [updateEvent] = useUpdateEventMutation();
  // const [updateLocation] = useUpdateLocationMutation();
  // const [updateEventOrganizeProjectMany] = useUpdateEventOrganizeProjectManyMutation();

  const updateBanner = () =>
    openModal({
      node: (
        <ImageEditorForm
          uploadContext={{ bucket: Buckets.Banners, entityName: EntityName.Event }}
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

  const { handleSubmit, register, formState, reset, control } = useForm({
    defaultValues,
    resolver: zodResolver(eventUpdateSchema),
  });

  const onSubmit = handleSubmit((update) => {
    updateEvent({
      variables: {
        update: {
          name: update.name,
          description: update.description,
          end: update.end.toISOString(),
          start: update.start.toISOString(),
        },
        id: eventManage.id,
      },
      onCompleted: () => reset({}, { keepValues: true }),
    });
  });

  return (
    <ViewLayout header={`Gérer : ${eventManage.name}`}>
      {eventManage && (
        <form onSubmit={onSubmit} className="grid lg-max:grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-16">
          <ChangeSetToast
            isDirty={formState.isDirty}
            isValid={formState.isValid}
            isLoading={formState.isSubmitting}
            onCancel={() => reset(defaultValues)}
          />
          <GroupItem heading="Bannière">
            <span className="flex flex-col gap-4">
              <span className="relative grow overflow-hidden" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
                <BannerImage src={eventManage.banner?.url} />
                <div
                  onClick={updateBanner}
                  className="p-5 absolute -inset-px opacity-0 hover:opacity-50 outline outline-black outline-1 z-20 cursor-pointer bg-black text-white flex gap-1 items-center justify-center"
                >
                  <div className="font-semibold text-center">Changer de bannière</div>
                </div>
              </span>
              <div className="shrink-0 flex justify-between py-1.5">
                <ActionButton
                  action={{
                    label: 'Changer la bannière',
                    linkOrActionOrMenu: updateBanner,
                    type: ActionType.Primary,
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
            </span>
          </GroupItem>
          <hr className="border-color-2 my-10 col-[1/-1] hidden lg-max:block" />
          <div className="flex flex-col gap-4">
            <TextInput error={formState.errors.name?.message} label="Nom de l'événements" {...register('name')} />
            <DateInput
              error={formState.errors.start?.message}
              label="Début de l'événement"
              includeTime={true}
              {...register('start')}
            />
            <DateInput
              error={formState.errors.end?.message}
              label="Fin de l'événements"
              includeTime={true}
              {...register('end')}
            />
            {canManageTeams.map(({ team }, idx) => (
              <div key={team.id} className="flex gap-4 items-center">
                <AvatarImage actor={team.actor} type="team" />
                <Controller
                  control={control}
                  name={`projects.${idx}.${team.id}`}
                  render={({ field }) => (
                    <SelectInput
                      {...field}
                      options={team.projects.map((project) => ({ label: project.name, value: project.id }))}
                      label={`${team.actor.name} - Projet lié`}
                    />
                  )}
                />
              </div>
            ))}
          </div>
          <hr className="border-color-2 my-10 col-[1/-1]" />
          <GroupItem heading="Présentation longue" groupClassName="flex flex-col gap-5">
            <TextAreaInput {...register('description')} label="Description" rows={7} />
          </GroupItem>
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
