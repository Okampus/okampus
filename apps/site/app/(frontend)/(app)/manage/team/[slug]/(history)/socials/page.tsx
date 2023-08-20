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

import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import type { SocialInfo } from '../../../../../../../../types/features/social.info';

const contactFormSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide.' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'Site internet invalide.' }).optional().or(z.literal('')),
});

type ContactFormSchema = z.infer<typeof contactFormSchema>;

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

  const defaultValues: ContactFormSchema = {
    email: teamManage?.actor?.email ?? '',
    website: teamManage?.actor?.website ?? '',
  };

  const [deleteSocials] = useDeleteSocialsMutation();
  const [insertSocials] = useInsertSocialsMutation();
  const [updateSocials] = useUpdateSocialsMutation();

  const [updateActor] = useUpdateActorMutation();

  // const [currentSocials, setCurrentSocials] = useState<SocialInfo[]>(initialSocials);

  const isSmall = currentWindowSize === 'mobile' || currentWindowSize === 'tablet';

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(contactFormSchema),
  });

  const defaultSocialValues: { socials: SocialInfo[] } = { socials: initialSocials };
  const socialForm = useForm({ defaultValues: defaultSocialValues });
  const socials = socialForm.watch('socials') ?? [];

  if (!teamManage?.actor) return <SkeletonViewLayout />;

  const onSubmitSocials = async (values: SocialInfo[]) => {
    const promises = [];
    const deletingSocials = initialSocials.filter((social) => !values.some((value) => value.id === social.id));

    if (deletingSocials.length > 0) {
      const _in = deletingSocials.map((social) => social.id);
      promises.push(
        deleteSocials({
          variables: { where: { id: { _in } } },
          onCompleted: ({ deleteSocial: data }) => {
            if (!teamManage.actor || !data) return;
            filterCache(
              { __typename: 'Actor', id: teamManage.actor.id },
              { fieldName: 'socials', typename: 'Social' },
              data.returning.map((social) => social.id),
            );
          },
        }),
      );
    }

    if (values.length > 0) {
      const newSocials = values.filter((social) => !social.id);
      const updatingSocials = values.filter((social, idx) => social.id && !deepEqual(initialSocials[idx], social));

      if (newSocials.length > 0) {
        const objects = newSocials.map((social) => ({ actorId: teamManage.actor?.id, ...social }));
        promises.push(
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
            },
          }),
        );
      }

      if (updatingSocials.length > 0) {
        const updates = updatingSocials.map(({ id, ..._set }) => ({ where: { id: { _eq: id } }, _set }));
        promises.push(updateSocials({ variables: { updates } }));
      }
    }

    await Promise.all(promises);
  };

  const onSubmit = handleSubmit(async (values) => {
    const promises = [];
    if (socialForm.formState.isDirty) promises.push(onSubmitSocials(socials));

    if (formState.isDirty) {
      const update = { email: values.email, website: values.website };
      promises.push(updateActor({ variables: { id: teamManage.actor.id, update } }));
    }

    await Promise.all(promises).then(() => {
      reset({}, { keepValues: true });
      socialForm.reset({ socials: socialForm.getValues('socials') });
    });
  });

  return (
    <ViewLayout header="Réseaux & contacts" innerClassName="pr-0" scrollable={isSmall} bottomPadded={false}>
      <div className="h-full grid xl-max:grid-cols-1 xl:grid-flow-col xl:grid-cols-[24rem_1fr] gap-4">
        <form onSubmit={onSubmit} className="col-span-1 pr-[var(--px-content)]">
          <ChangeSetToast
            isDirty={formState.isDirty || socialForm.formState.isDirty}
            isValid={Object.entries(formState.errors).length === 0 && socialForm.formState.isValid}
            onCancel={() => {
              reset(defaultValues);
              socialForm.reset(defaultSocialValues);
            }}
          />
          <div className="flex flex-col gap-4">
            <TextInput error={formState.errors.email?.message} label="Email" {...register('email')} />
            <TextInput
              error={formState.errors.website?.message}
              label="URL de votre site/page internet"
              {...register('website')}
            />
          </div>
          <hr className="border-color-2 my-10" />
          <GroupItem heading="Prévisualisation de vos réseaux">
            <Profile type="team" actor={teamManage.actor} socials={socials} />
          </GroupItem>
        </form>
        <div className={clsx('h-full w-full flex flex-col gap-2', !isSmall && 'scrollbar overflow-y-scroll')}>
          <h3 className="text-2 label-title">Réseaux sociaux</h3>
          <SocialsForm formMethods={socialForm} className="pr-[var(--px-content)]" />
        </div>
      </div>
    </ViewLayout>
  );
}
