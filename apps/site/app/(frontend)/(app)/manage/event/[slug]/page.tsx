'use client';

import AvatarImage from '../../../../../../components/atoms/Image/AvatarImage';
import BannerImage from '../../../../../../components/atoms/Image/BannerImage';
import GroupItem from '../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';

import ActionButton from '../../../../../../components/molecules/Button/ActionButton';
import ChangeSetToast from '../../../../../../components/organisms/Form/ChangeSetToast';
import ImageEditorForm from '../../../../../../components/molecules/ImageEditor/ImageEditorForm';
import DateInput from '../../../../../../components/molecules/Input/Date/DateInput';
import FieldSet from '../../../../../../components/molecules/Input/FieldSet';
import SelectInput from '../../../../../../components/molecules/Input/Select/SelectInput';
import TextAreaInput from '../../../../../../components/molecules/Input/TextAreaInput';
import TextInput from '../../../../../../components/molecules/Input/TextInput';

import { useEventManage, useMe } from '../../../../../../context/navigation';
import { useModal } from '../../../../../../hooks/context/useModal';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { Buckets, EntityName, TeamPermissions } from '@okampus/shared/enums';
import { useUpdateEventMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';
import { isNotNull } from '@okampus/shared/utils';

import { Controller, useForm } from 'react-hook-form';
import type { EventManageInfo } from '../../../../../../context/navigation';

const getHour = (dateISOString: string) => dateISOString.split('T')[1].slice(0, 5) || '00:00';

function ManageEventPageInner({ eventManage }: { eventManage: EventManageInfo }) {
  const defaultValues = {
    name: eventManage.name,
    text: eventManage.content.text,
    startDate: eventManage.start,
    startTime: getHour(eventManage.start),
    endDate: eventManage.end,
    endTime: getHour(eventManage.end),
    location: eventManage.location,
    ...Object.fromEntries(
      eventManage.eventOrganizes.map(({ team, project }) => (project ? [team.id, project.id] : null)).filter(isNotNull),
    ),
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

  const { handleSubmit, register, formState, reset, control } = useForm({ defaultValues });
  const onSubmit = handleSubmit((update) =>
    updateEvent({ variables: { update, id: eventManage.id }, onCompleted: () => reset({}, { keepValues: true }) }),
  );

  // const projects = Object.fromEntries(
  //   eventManage.eventOrganizes.map(({ team, project }) => (project ? [team.id, project.id] : null)).filter(isNotNull),
  // );

  return (
    <ViewLayout header={`Gérer : ${eventManage.name}`}>
      {eventManage && (
        <form onSubmit={onSubmit} className="grid lg-max:grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-16">
          <ChangeSetToast changed={formState.isDirty} errors={{}} loading={[]} onCancel={() => reset(defaultValues)} />
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
            <TextInput
              {...register('name')}
              // onChange={(value) => changeValues((values) => ({ ...values, name: value }))}
              // onErrorChange={(error) => changeErrors({ name: error })}
              // value={values.name}
              // label="Nom"
            />
            <FieldSet label="Date de début">
              {/* <div className="grid grid-cols-[1fr_8rem] gap-4"> */}
              <DateInput
                {...register('startDate')}
                // className="w-full"
                // date={values.startDate}
                // onChange={(date) => changeValues((values) => ({ ...values, startDate: date }))}
                // label="Date de début"
                // name="startDate"
              />
              <input
                {...register('startTime')}
                className="input"
                type="time"
                // value={values.startTime}
                // onChange={(e) => changeValues((values) => ({ ...values, startTime: e.target.value }))}
              />
            </FieldSet>
            {/* </div> */}
            <FieldSet label="Date de fin">
              {/* <div className="grid grid-cols-[1fr_8rem] gap-4"> */}
              <DateInput
                {...register('endDate')}
                // className="w-full"
                // date={values.endDate}
                // onChange={(date) => changeValues((values) => ({ ...values, endDate: date }))}
                // label="Date de fin"
                // name="endDate"
              />
              <input {...register('endTime')} className="input" type="time" />
              {/* </div> */}
            </FieldSet>
            {canManageTeams.map(({ team }) => (
              <div key={team.id} className="flex gap-4 items-center">
                <AvatarImage actor={team.actor} type="team" />
                <Controller
                  control={control}
                  name={team.id}
                  render={({ field }) => (
                    <SelectInput
                      {...field}
                      options={team.projects.map((project) => ({ label: project.name, value: project.id }))}
                      label={`${team.actor.name} - Projet lié`}
                    />
                  )}
                />
                {/* <SelectInput
                  name={team.id}
                  options={team.projects.map((project) => ({ label: project.name, value: project.id }))}
                  onChange={(value) => setValue(team.id, value)}
                  value={projects[team.id]}
                  label={`${team.actor.name} - Projet lié`}
                /> */}
              </div>
            ))}
            {/* <SelectInput
                    onChange={(value) => changeValues((values) => ({ ...values, project: value }))}
                    items={eventManage.projects}
                  /> */}
            {/* <TextInput
                    onChange={(value) => changeValues((values) => ({ ...values, status: value }))}
                    onErrorChange={(error) => changeErrors({ status: error })}
                    value={values.status}
                    label='Slogan' }}
                  /> */}
          </div>
          <hr className="border-color-2 my-10 col-[1/-1]" />
          <GroupItem heading="Présentation longue" groupClassName="flex flex-col gap-5">
            <TextAreaInput
              {...register('description')}
              label="Description"
              // value={values.text}
              // onChange={(value) => changeValues((values) => ({ ...values, text: value }))}
              // onErrorChange={(error) => changeErrors({ text: error })}
              rows={10}
            />
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
