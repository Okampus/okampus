'use client';

import AvatarEditor from '../../../../../../components/molecules/ImageEditor/AvatarEditor';
import BannerEditor from '../../../../../../components/molecules/ImageEditor/BannerEditor';
import GroupItem from '../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';

import ActionButton from '../../../../../../components/molecules/Button/ActionButton';
import ChangeSetForm from '../../../../../../components/molecules/Form/ChangeSetForm';
import TextInput from '../../../../../../components/molecules/Input/TextInput';

import { getAvatar } from '../../../../../../utils/actor-image/get-avatar';
import { getBanner } from '../../../../../../utils/actor-image/get-banner';

import { useTeamManage } from '../../../../../../context/navigation';

import { deleteActorImageMutation, updateActorMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { useState } from 'react';
import { useMutation } from '@apollo/client';

export default function TeamManageProfilePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  const avatar = getAvatar(teamManage?.actor?.actorImages);
  const banner = getBanner(teamManage?.actor?.actorImages);

  const initialState = {
    name: teamManage?.actor?.name || '',
    status: teamManage?.actor?.status || '',
    bio: teamManage?.actor?.bio || '',
  };

  const [deactivateActorImage] = useMutation(deleteActorImageMutation);
  const [updateActor] = useMutation(updateActorMutation);

  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editingBanner, setEditingBanner] = useState(false);

  return (
    <ViewLayout header="Personalisation">
      <ChangeSetForm
        // @ts-ignore
        onSave={(update) => teamManage?.actor && updateActor({ variables: { update, id: teamManage.actor.id } })}
        initialValues={initialState}
        checkFields={[]}
        renderChildren={({ changeErrors, changeValues, values }) =>
          teamManage?.actor && (
            <span className="grid lg-max:grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-16">
              <GroupItem heading="Logo">
                <span className="flex gap-6">
                  <AvatarEditor
                    showEditor={editingAvatar}
                    setShowEditor={setEditingAvatar}
                    actor={teamManage.actor}
                    size={48}
                    type="team"
                  />
                  <div className="flex flex-col justify-between py-1">
                    <ActionButton
                      action={{
                        label: 'Changer le logo',
                        linkOrActionOrMenu: () => setEditingAvatar(true),
                        type: ActionType.Primary,
                      }}
                    />
                    {avatar && (
                      <ActionButton
                        action={{
                          label: 'Enlever le logo',
                          linkOrActionOrMenu: () =>
                            deactivateActorImage({ variables: { id: avatar.id, now: new Date().toISOString() } }),
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
                <TextInput
                  onChange={(value) => changeValues((values) => ({ ...values, status: value }))}
                  onErrorChange={(error) => changeErrors({ status: error })}
                  value={values.status}
                  options={{ label: 'Slogan' }}
                />
              </GroupItem>
              <hr className="border-color-2 my-10 col-[1/-1]" />
              <GroupItem heading="Bannière">
                <span className="flex flex-col gap-4">
                  <BannerEditor showEditor={editingBanner} setShowEditor={setEditingBanner} actor={teamManage.actor} />
                  {/* <BannerImage
                    aspectRatio={BANNER_ASPECT_RATIO}
                    src={banner?.fileUpload.url}
                    name={teamManage.actor.name}
                    className="grow border-4 border-[var(--border-2)]"
                  /> */}
                  <div className="shrink-0 flex justify-between py-1.5">
                    <ActionButton
                      action={{
                        label: 'Changer la bannière',
                        linkOrActionOrMenu: () => setEditingBanner(true),
                        type: ActionType.Primary,
                      }}
                    />
                    {banner && (
                      <ActionButton
                        action={{
                          label: 'Enlever',
                          linkOrActionOrMenu: () =>
                            deactivateActorImage({ variables: { id: banner.id, now: new Date().toISOString() } }),
                        }}
                      />
                    )}
                  </div>
                </span>
              </GroupItem>
              <hr className="border-color-2 my-10 col-[1/-1] hidden lg-max:block" />
              <GroupItem heading="Présentation longue" groupClassName="flex flex-col gap-5">
                <TextInput
                  value={values.bio}
                  onChange={(value) => changeValues((values) => ({ ...values, bio: value }))}
                  onErrorChange={(error) => changeErrors({ bio: error })}
                  rows={10}
                  options={{ label: 'Description' }}
                />
              </GroupItem>
            </span>
          )
        }
      />
    </ViewLayout>
  );
}
