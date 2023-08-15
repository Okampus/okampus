'use client';

import GroupItem from '../../../../../../../../components/atoms/Item/GroupItem';
import ViewLayout from '../../../../../../../../components/atoms/Layout/ViewLayout';
import SkeletonViewLayout from '../../../../../../../../components/atoms/Skeleton/SkeletonViewLayout';

import SocialsForm from '../../../../../../../../components/forms/SocialsForm';
import Profile from '../../../../../../../../components/layouts/SidePanel/Profile';

import TextInput from '../../../../../../../../components/molecules/Input/TextInput';
import ChangeSetToast from '../../../../../../../../components/organisms/Form/ChangeSetToast';

import { useTeamManage } from '../../../../../../../../context/navigation';

import { useCurrentBreakpoint } from '../../../../../../../../hooks/useCurrentBreakpoint';
import { filterCache, mergeCache } from '../../../../../../../../utils/apollo/merge-cache';

import {
  useDeleteSocialsMutation,
  useInsertSocialsMutation,
  useUpdateActorMutation,
  useUpdateSocialsMutation,
} from '@okampus/shared/graphql';
import { deepEqual } from '@okampus/shared/utils';

import clsx from 'clsx';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import type { SocialInfo } from '../../../../../../../../types/features/social.info';

export default function TeamManageSocials({ params }: { params: { slug: string } }) {
  const { teamManage } = useTeamManage(params.slug);
  const currentWindowSize = useCurrentBreakpoint();

  const initialSocials = teamManage?.actor?.socials
    ? [...teamManage.actor.socials]
        .sort((a, b) => a.order - b.order)
        .map((social) => ({
          id: social.id,
          type: social.type,
          url: social.url,
          pseudo: social.pseudo,
          order: social.order,
        }))
    : [];

  const defaultValues = {
    email: teamManage?.actor?.email ?? '',
    website: teamManage?.actor?.website ?? '',
  };

  const [deleteSocials] = useDeleteSocialsMutation();
  const [insertSocials] = useInsertSocialsMutation();
  const [updateSocials] = useUpdateSocialsMutation();

  const [updateActor] = useUpdateActorMutation();

  const [currentSocials, setCurrentSocials] = useState<SocialInfo[]>(initialSocials);

  const isSmall = currentWindowSize === 'mobile' || currentWindowSize === 'tablet';

  const { register, handleSubmit, formState, setValue, watch, reset } = useForm({
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => {
    if (teamManage?.actor) {
      const update = { email: values.email, website: values.website };
      updateActor({
        variables: { id: teamManage.actor.id, update },
        onCompleted: () => reset({}, { keepValues: true }),
      });
    }
  });

  if (!teamManage?.actor) return <SkeletonViewLayout />;

  const onSubmitSocials = (values: SocialInfo[], callback?: () => void) => {
    const deletingSocials = initialSocials.filter((social) => !values.some((value) => value.id === social.id));

    if (deletingSocials.length > 0) {
      const _in = deletingSocials.map((social) => social.id);
      deleteSocials({
        variables: { where: { id: { _in } } },
        onCompleted: ({ deleteSocial: data }) => {
          if (!teamManage.actor || !data) return;
          filterCache(
            { __typename: 'Actor', id: teamManage.actor.id },
            { fieldName: 'socials', typename: 'Social' },
            data.returning.map((social) => social.id),
          );
          callback?.();
        },
      });
    }

    if (values.length > 0) {
      const newSocials = values.filter((social) => !social.id);
      const updatingSocials = values.filter((social, idx) => social.id && !deepEqual(initialSocials[idx], social));

      if (newSocials.length > 0) {
        const objects = newSocials.map((social) => ({ actorId: teamManage.actor?.id, ...social }));
        insertSocials({
          variables: { objects },
          onCompleted: ({ insertSocial: data }) => {
            if (!data) return;
            for (const social of data.returning) {
              mergeCache(
                { __typename: 'Actor', id: teamManage.actor.id },
                { fieldName: 'socials', fragmentOn: 'Social', data: social },
              );
            }
            callback?.();
          },
        });
      }

      if (updatingSocials.length > 0) {
        const updates = updatingSocials.map(({ id, ..._set }) => ({ where: { id: { _eq: id } }, _set }));
        updateSocials({ variables: { updates }, onCompleted: callback });
      }
    }
  };

  return (
    <ViewLayout header="Réseaux & contacts" innerClassName="pr-0" scrollable={isSmall} bottomPadded={false}>
      <div className="h-full grid xl-max:grid-cols-1 xl:grid-flow-col xl:grid-cols-[24rem_1fr] gap-4">
        <form onSubmit={onSubmit} className="col-span-1 pr-[var(--px-content)]">
          <ChangeSetToast changed={formState.isDirty} errors={{}} loading={[]} onCancel={() => reset(defaultValues)} />
          <div className="flex flex-col gap-4">
            <TextInput {...register('email')} label="Email" />
            <TextInput {...register('website')} label="URL de votre site/page internet" />
          </div>
          <hr className="border-color-2 my-10" />
          <GroupItem heading="Prévisualisation de vos réseaux">
            <Profile type="team" actor={teamManage.actor} socials={currentSocials} />
          </GroupItem>
        </form>
        <div className={clsx('h-full w-full flex flex-col gap-2', !isSmall && 'scrollbar overflow-y-scroll')}>
          <h3 className="text-2 label-title">Réseaux sociaux</h3>
          <SocialsForm
            className="pr-[var(--px-content)]"
            initialSocials={initialSocials}
            onChangeSocials={setCurrentSocials}
            onSubmit={onSubmitSocials}
          />
        </div>
      </div>
    </ViewLayout>
  );
}
