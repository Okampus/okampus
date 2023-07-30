'use client';

import AvatarImage from '../../../../../../components/atoms/Image/AvatarImage';
import BannerImage from '../../../../../../components/atoms/Image/BannerImage';
import GroupItem from '../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';
import ActionButton from '../../../../../../components/molecules/Button/ActionButton';
import DateInput from '../../../../../../components/molecules/Input/DateInput';
import ChangeSetForm from '../../../../../../components/molecules/Form/ChangeSetForm';
import ImageEditorForm from '../../../../../../components/molecules/ImageEditor/ImageEditorForm';
import SelectInput from '../../../../../../components/molecules/Input/SelectInput';
import TextInput from '../../../../../../components/molecules/Input/TextInput';

import { useEventManage, useMe } from '../../../../../../context/navigation';
import { useModal } from '../../../../../../hooks/context/useModal';

import { BANNER_ASPECT_RATIO } from '@okampus/shared/consts';
import { Buckets, EntityName, TeamPermissions } from '@okampus/shared/enums';
import { actorBaseInfo, projectBaseInfo, updateEventMutation, useTypedQuery } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { useMutation } from '@apollo/client';

const getHour = (date: Date) => {
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

export default function ManageEventPage({ params }: { params: { slug: string } }) {
  const { eventManage } = useEventManage(params.slug);

  const { openModal, closeModal } = useModal();
  const me = useMe();

  const canManageTeamIds = eventManage?.eventOrganizes
    .filter(
      ({ team }) =>
        me?.canManageTenant ||
        me?.user.teamMembers.some(
          (teamMember) =>
            teamMember.team.id === team.id &&
            teamMember.teamMemberRoles.some(({ role }) =>
              (role.permissions as string[])?.includes(TeamPermissions.ManageEvents.toString())
            )
        )
    )
    .map(({ team }) => team.id);

  const { data } = useTypedQuery({
    team: [
      { where: { id: { _in: canManageTeamIds } } },
      { id: true, actor: actorBaseInfo, projects: [{}, projectBaseInfo] },
    ],
  });

  const initialState = {
    name: eventManage?.name || '',
    text: eventManage?.content.text || '',
    startDate: eventManage?.start ? new Date(eventManage.start) : new Date(),
    startTime: eventManage?.start ? getHour(new Date(eventManage.start)) : getHour(new Date()),
    endDate: eventManage?.end ? new Date(eventManage.end) : new Date(),
    endTime: eventManage?.end ? getHour(new Date(eventManage.end)) : getHour(new Date()),
    location: eventManage?.location || null,
  };

  const [updateEvent] = useMutation(updateEventMutation);

  const updateBanner = () =>
    openModal({
      node: (
        <ImageEditorForm
          uploadContext={{ bucket: Buckets.Banners, entityName: EntityName.Event }}
          onUploaded={(fileId, onCompleted, onError) =>
            updateEvent({
              // @ts-ignore
              variables: { banner: fileId },
              onCompleted: ({ updateEventByPk }) => {
                if (!updateEventByPk || !updateEventByPk.banner) onError();
                else onCompleted();
                closeModal();
              },
            })
          }
        />
      ),
    });

  if (!eventManage) return null;

  const projects = Object.fromEntries(eventManage?.eventOrganizes.map(({ team, project }) => [team.id, project?.id]));
  return (
    <ViewLayout header={`Gérer : ${eventManage.name}`}>
      <ChangeSetForm
        checkFields={[]}
        // @ts-ignore
        onSave={(update) => updateEvent({ variables: { update, id: eventManage.id } })}
        initialValues={{ ...initialState, ...projects }}
        renderChildren={({ changeErrors, changeValues, values }) =>
          eventManage && (
            <div>
              <span className="grid lg-max:grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-16">
                <GroupItem heading="Bannière">
                  <span className="flex flex-col gap-4">
                    <span className="relative grow overflow-hidden" style={{ aspectRatio: BANNER_ASPECT_RATIO }}>
                      <BannerImage src={eventManage.banner?.url} />
                      <div
                        onClick={updateBanner}
                        className="p-5 absolute -inset-px opacity-0 hover:opacity-75 outline outline-black outline-1 z-20 cursor-pointer bg-black text-white flex gap-1 items-center justify-center"
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
                            // @ts-ignore
                            linkOrActionOrMenu: () => updateEvent({ variables: { banner: null } }),
                          }}
                        />
                      )}
                    </div>
                  </span>
                </GroupItem>
                <hr className="border-color-2 my-10 col-[1/-1] hidden lg-max:block" />
                <GroupItem heading="En-tête" groupClassName="flex flex-col gap-4 py-1">
                  <TextInput
                    onChange={(value) => changeValues((values) => ({ ...values, name: value }))}
                    onErrorChange={(error) => changeErrors({ name: error })}
                    value={values.name}
                    options={{ label: 'Nom' }}
                  />
                  <div className="grid grid-cols-[1fr_8rem] gap-4">
                    <DateInput
                      className="w-full"
                      date={values.startDate}
                      onChange={(date) => changeValues((values) => ({ ...values, startDate: date }))}
                      options={{ label: 'Date de début', name: 'startDate' }}
                    />
                    <input
                      className="input"
                      type="time"
                      value={values.startTime}
                      onChange={(e) => changeValues((values) => ({ ...values, startTime: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-[1fr_8rem] gap-4">
                    <DateInput
                      className="w-full"
                      date={values.endDate}
                      onChange={(date) => changeValues((values) => ({ ...values, endDate: date }))}
                      options={{ label: 'Date de fin', name: 'endDate' }}
                    />
                    <input
                      className="input"
                      type="time"
                      value={values.endTime}
                      onChange={(e) => changeValues((values) => ({ ...values, endTime: e.target.value }))}
                    />
                  </div>
                  {data?.team.map((team) => (
                    <div key={team.id} className="flex gap-4 items-center">
                      <AvatarImage actor={team.actor} type="team" />
                      <SelectInput
                        items={team.projects.map((project) => ({ label: project.name, value: project.id }))}
                        onChange={(value) => changeValues((values) => ({ ...values, [team.id]: value }))}
                        value={projects[team.id]}
                        options={{ label: `${team.actor.name} - Projet lié` }}
                      />
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
                    options={{ label: 'Slogan' }}
                  /> */}
                </GroupItem>
                <hr className="border-color-2 my-10 col-[1/-1]" />
              </span>
              <GroupItem heading="Présentation longue" groupClassName="flex flex-col gap-5">
                <TextInput
                  value={values.text}
                  onChange={(value) => changeValues((values) => ({ ...values, text: value }))}
                  onErrorChange={(error) => changeErrors({ text: error })}
                  rows={10}
                  options={{ label: 'Description' }}
                />
              </GroupItem>
            </div>
          )
        }
      />
    </ViewLayout>
  );
}
