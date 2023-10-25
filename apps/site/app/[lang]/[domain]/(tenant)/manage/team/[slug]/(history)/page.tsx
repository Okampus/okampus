'use client';

import AvatarEditor from '../../../../../../../_components/molecules/ImageCropper/AvatarEditor';
import BannerEditor from '../../../../../../../_components/molecules/ImageCropper/BannerEditor';
import SimpleList from '../../../../../../../_components/molecules/List/SimpleList';
import ViewLayout from '../../../../../../../_components/atoms/Layout/ViewLayout';

import ActionButton from '../../../../../../../_components/molecules/Button/ActionButton';
import TextAreaInput from '../../../../../../../_components/molecules/Input/TextAreaInput';

import { notificationAtom } from '../../../../../../../_context/global';
import { useTeamManage } from '../../../../../../../_context/navigation';

import TextInput from '../../../../../../../_components/molecules/Input/TextInput';
import ChangeSetToast from '../../../../../../../_components/organisms/Form/ChangeSetToast';

import { TeamManageFragment } from '../../../../../../../../utils/apollo/fragments';
import { updateFragment } from '../../../../../../../../utils/apollo/update-fragment';

import { useDeleteActorImageMutation, useUpdateActorMutation } from '@okampus/shared/graphql';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClockCounterClockwise } from '@phosphor-icons/react';
import { ActorImageType, ActorType } from '@prisma/client';

import { useAtom } from 'jotai';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import type { TeamInfo } from '../../../../../../../../utils/apollo/fragments';

const teamFormSchema = z.object({
  name: z
    .string({ required_error: "Nom de l'association requis." })
    .min(3, { message: "Le nom de l'association doit faire au moins 3 caractères." })
    .max(100, { message: "Le nom de l'association ne peut pas dépasser 100 caractères." }),
  status: z
    .string()
    .max(100, { message: "Le slogan de l'association ne peut pas dépasser 100 caractères." })
    .or(z.literal('')),
  bio: z
    .string()
    .max(50_000, { message: "La description de l'association ne peut pas dépasser 50 000 caractères." })
    .or(z.literal('')),
});

export default function TeamManageProfilePage({ params }: { params: { slug: string } }) {
  const [, setNotification] = useAtom(notificationAtom);

  const { teamManage } = useTeamManage(params.slug);

  const defaultValues: z.infer<typeof teamFormSchema> = {
    name: teamManage?.actor?.name ?? '',
    status: teamManage?.actor?.status ?? '',
    bio: teamManage?.actor?.bio ?? '',
  };

  const [deactivateActorImage] = useDeleteActorImageMutation();

  const [updateActor] = useUpdateActorMutation();

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(teamFormSchema),
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
    <ViewLayout header="Personnalisation" sidePanelIcon={<ClockCounterClockwise className="h-7 w-7" />}>
      <form onSubmit={onSubmit} className="grid lg-max:grid-cols-1 lg:grid-cols-[24rem_1fr] gap-x-16">
        <ChangeSetToast
          isDirty={formState.isDirty}
          isValid={formState.isValid}
          isLoading={formState.isSubmitting}
          onCancel={() => reset(defaultValues)}
        />
        <SimpleList heading="Logo">
          <span className="flex gap-6">
            <AvatarEditor
              actor={teamManage.actor}
              size={128}
              context={{ actorImageType: ActorImageType.Avatar, actorType: ActorType.Team, slug: teamManage.slug }}
            />
            <div className="flex flex-col justify-between py-1">
              {/* <ActionButton
                action={{
                  label: 'Changer le logo',
                  linkOrActionOrMenu: () => setEditingAvatar(true),
                  type: ActionType.Primary,
                }}
              /> */}
              {teamManage.actor.avatar && (
                <ActionButton
                  action={{
                    label: 'Enlever le logo',
                    linkOrActionOrMenu: () => {
                      deactivateActorImage({
                        variables: {
                          where: {
                            type: { _eq: ActorImageType.Avatar },
                            actorId: { _eq: teamManage.actor.id },
                            deletedAt: { _isNull: true },
                          },
                        },
                        onCompleted: () => {
                          updateFragment<TeamInfo>({
                            __typename: 'Team',
                            fragment: TeamManageFragment,
                            where: { slug: teamManage.slug },
                            update: (team) => ({ ...team, actor: { ...team.actor, avatar: '' } }),
                          });
                          setNotification({ message: 'Logo retiré.' });
                        },
                      });
                    },
                  }}
                />
              )}
            </div>
          </span>
        </SimpleList>
        <hr className="border-[var(--border-2)] my-10 col-[1/-1] hidden lg-max:block" />
        <div className="flex flex-col gap-4">
          <TextInput error={formState.errors.name?.message} label="Nom" {...register('name')} />
          <TextInput error={formState.errors.status?.message} label="Slogan" {...register('status')} />
        </div>
        <hr className="border-[var(--border-2)] my-10 col-[1/-1]" />
        <SimpleList heading="Bannière">
          <span className="flex flex-col gap-4">
            <BannerEditor
              actor={teamManage.actor}
              context={{ actorImageType: ActorImageType.Banner, actorType: ActorType.Team, slug: teamManage.slug }}
            />
            <div className="shrink-0 flex justify-between py-1.5">
              {/* <ActionButton
                action={{
                  label: 'Changer la bannière',
                  linkOrActionOrMenu: () => setEditingBanner(true),
                  type: ActionType.Primary,
                }}
              /> */}
              {teamManage.actor.banner && (
                <ActionButton
                  action={{
                    label: 'Enlever',
                    linkOrActionOrMenu: () => {
                      deactivateActorImage({
                        variables: {
                          where: {
                            type: { _eq: ActorImageType.Banner },
                            actorId: { _eq: teamManage.actor.id },
                            deletedAt: { _isNull: true },
                          },
                        },
                        onCompleted: () => {
                          setNotification({ message: 'Bannière retirée.' });
                          updateFragment<TeamInfo>({
                            __typename: 'Team',
                            fragment: TeamManageFragment,
                            where: { slug: teamManage.slug },
                            update: (team) => ({ ...team, actor: { ...team.actor, banner: '' } }),
                          });
                        },
                      });
                    },
                  }}
                />
              )}
            </div>
          </span>
        </SimpleList>
        <hr className="border-[var(--border-2)] my-10 col-[1/-1] hidden lg-max:block" />
        <TextAreaInput error={formState.errors.bio?.message} {...register('bio')} rows={10} label="Description" />
      </form>
    </ViewLayout>
  );
}
