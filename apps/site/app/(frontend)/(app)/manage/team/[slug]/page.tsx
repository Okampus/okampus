'use client';

import AvatarEditor from '../../../../../../components/molecules/ImageEditor/AvatarEditor';
import BannerEditor from '../../../../../../components/molecules/ImageEditor/BannerEditor';
import GroupItem from '../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../components/atoms/Layout/ViewLayout';

import ActionButton from '../../../../../../components/molecules/Button/ActionButton';
import TextAreaInput from '../../../../../../components/molecules/Input/TextAreaInput';

import { getAvatar } from '../../../../../../utils/actor-image/get-avatar';
import { getBanner } from '../../../../../../utils/actor-image/get-banner';

import { useTeamManage } from '../../../../../../context/navigation';

// import { useForm } from '../../../../../../hooks/form/useForm';
import TextInput from '../../../../../../components/molecules/Input/TextInput';
import ChangeSetToast from '../../../../../../components/organisms/Form/ChangeSetToast';

import { useDeleteActorImageMutation, useUpdateActorMutation } from '@okampus/shared/graphql';
import { ActionType } from '@okampus/shared/types';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function TeamManageProfilePage({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);

  const avatar = getAvatar(teamManage?.actor?.actorImages);
  const banner = getBanner(teamManage?.actor?.actorImages);

  const defaultValues = {
    name: teamManage?.actor?.name ?? '',
    status: teamManage?.actor?.status ?? '',
    bio: teamManage?.actor?.bio ?? '',
  };

  const [deactivateActorImage] = useDeleteActorImageMutation();
  const [updateActor] = useUpdateActorMutation();

  const [editingAvatar, setEditingAvatar] = useState(false);
  const [editingBanner, setEditingBanner] = useState(false);

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues,
    mode: 'onChange',
  });

  const onSubmit = handleSubmit((update) => {
    teamManage?.actor &&
      updateActor({
        variables: { update, id: teamManage.actor.id },
        onCompleted: () => reset({}, { keepValues: true }),
      });
  });

  if (!teamManage) return null;

  return (
    <ViewLayout header="Personalisation">
      <form onSubmit={onSubmit} className="grid lg-max:grid-cols-1 lg:grid-cols-[auto_1fr] gap-x-16">
        <ChangeSetToast changed={formState.isDirty} errors={{}} loading={[]} onCancel={() => reset(defaultValues)} />
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
                    linkOrActionOrMenu: () => deactivateActorImage({ variables: { id: avatar.id } }),
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
            // name="name"
            // onChange={(event) => }
            // onErrorChange={(error) => changeErrors({ name: error })}
            // value={values.name}
            label="Nom"
          />
          <TextInput
            {...register('status')}
            // name="status"
            // onChange={(event) => changeValues((values) => ({ ...values, status: event.target.value }))}
            // onErrorChange={(error) => changeErrors({ status: error })}
            // value={values.sttus}
            label="Slogan"
          />
        </div>
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
                    linkOrActionOrMenu: () => deactivateActorImage({ variables: { id: banner.id } }),
                  }}
                />
              )}
            </div>
          </span>
        </GroupItem>
        <hr className="border-color-2 my-10 col-[1/-1] hidden lg-max:block" />
        <TextAreaInput {...register('bio')} rows={10} label="Description" />
      </form>
    </ViewLayout>
  );
}
