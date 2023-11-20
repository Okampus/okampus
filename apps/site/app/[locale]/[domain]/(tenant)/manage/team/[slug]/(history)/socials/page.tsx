import BaseView from '../../../../../../../../_components/templates/BaseView';
import SkeletonViewLayout from '../../../../../../../../_components/atoms/Skeleton/SkeletonViewLayout';

import SocialsForm from '../../../../../../../../_views/Form/SocialsForm';

import TextInput from '../../../../../../../../_components/molecules/Input/Uncontrolled/String/TextInput';
import ChangeSetToast from '../../../../../../../../_components/organisms/Form/ChangeSetToast';

import { useCurrentBreakpoint } from '../../../../../../../../_hooks/useCurrentBreakpoint';

import prisma from '../../../../../../../../../database/prisma/db';
import { teamDetails } from '../../../../../../../../../types/prisma/Team/team-details';
// import {
//   useDeleteSocialsMutation,
//   useInsertSocialsMutation,
//   useUpdateActorMutation,
//   useUpdateSocialsMutation,
// } from '@okampus/shared/graphql';
import { deepEqual } from '@okampus/shared/utils';

import { zodResolver } from '@hookform/resolvers/zod';
import { ClockCounterClockwise } from '@phosphor-icons/react';

import clsx from 'clsx';
import { useForm } from 'react-hook-form';

import * as z from 'zod';
import type { DomainSlugParams } from '../../../../../../../../params.type';
import type { SocialMinimal } from '../../../../../../../../../types/prisma/Social/social-minimal';

const contactFormSchema = z.object({
  email: z.string().email({ message: 'Adresse email invalide.' }).optional().or(z.literal('')),
  website: z.string().url({ message: 'Site internet invalide.' }).optional().or(z.literal('')),
});

type ContactFormSchema = z.infer<typeof contactFormSchema>;

export default async function TeamManageSocials({ params }: DomainSlugParams) {
  // const { teamManage } = useTeamManage(params.slug);
  const teamManage = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: teamDetails.select,
  });

  const currentWindowSize = useCurrentBreakpoint();

  const initialSocials = teamManage?.actor?.socials
    ? [...teamManage.actor.socials]
        .sort((a, b) => a.order - b.order)
        .map((social) => ({
          id: BigInt(social.id),
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

  // const [deleteSocials] = useDeleteSocialsMutation();
  // const [insertSocials] = useInsertSocialsMutation();
  // const [updateSocials] = useUpdateSocialsMutation();

  // const [updateActor] = useUpdateActorMutation();

  // const [currentSocials, setCurrentSocials] = useState<SocialMinimal[]>(initialSocials);

  const isSmall = currentWindowSize === 'mobile' || currentWindowSize === 'tablet';

  const { register, handleSubmit, formState, reset } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: zodResolver(contactFormSchema),
  });

  const defaultSocialValues: { socials: SocialMinimal[] } = { socials: initialSocials };
  const socialForm = useForm({ defaultValues: defaultSocialValues });
  const socials = socialForm.watch('socials') ?? [];

  if (!teamManage?.actor) return <SkeletonViewLayout />;

  // TODO: SIMPLIFY ALL THIS IN ONE COMPLEX QUERY or refactor everything lol
  const onSubmitSocials = async (values: SocialMinimal[]) => {
    const promises: Promise<void>[] = [];
    const deletingSocials = initialSocials.filter((social) => !values.some((value) => value.id === social.id));

    if (deletingSocials.length > 0) {
      const _in = deletingSocials.map((social) => social.id.toString());
      promises
        .push
        // TODO
        // deleteSocials({
        //   variables: { where: { id: { _in } } },
        //   onCompleted: ({ deleteSocial: data }) => {
        //     if (!teamManage.actor || !data) return;
        //     // updateFragment<TeamInfo>({
        //     //   __typename: 'Team',
        //     //   fragment: TeamFragment,
        //     //   where: { slug: teamManage.slug },
        //     //   update: (team) =>
        //     //     produce(team, (draft) => {
        //     //       draft.actor.socials = draft.actor.socials.filter(
        //     //         (social) => !data.returning.some((removedSocial) => removedSocial.id === social.id),
        //     //       );
        //     //     }),
        //     // });
        //   },
        // }),
        ();
    }

    if (values.length > 0) {
      const added = values.filter((social) => !social.id);
      if (added.length > 0) {
        promises
          .push
          // TODO
          // insertSocials({
          //   variables: {
          //     objects: added.map(({ id: _, ...social }) => ({ actorId: teamManage.actor.id.toString(), ...social })),
          //   },
          //   onCompleted: ({ insertSocial: data }) => {
          //     if (!data) return;
          //     // updateFragment<TeamInfo>({
          //     //   __typename: 'Team',
          //     //   fragment: TeamFragment,
          //     //   where: { slug: teamManage.slug },
          //     //   update: (team) =>
          //     //     produce(team, (draft) => {
          //     //       draft.actor.socials.push(...data.returning);
          //     //     }),
          //     // });
          //   },
          // }),
          ();
      }

      const updatingSocials = values
        .filter((social, idx) => social.id && !deepEqual(initialSocials[idx], social))
        .map(({ id, ..._set }) => ({ where: { id: { _eq: id?.toString() } }, _set }));

      if (updatingSocials.length > 0) {
        // TODO
        // promises.push(updateSocials({ variables: { updates: updatingSocials } }));
      }
    }

    await Promise.all(promises);
  };

  const onSubmit = handleSubmit(async (values) => {
    const promises = [];
    if (socialForm.formState.isDirty) promises.push(onSubmitSocials(socials));

    if (formState.isDirty) {
      const update = { email: values.email, website: values.website };
      // promises.push(updateActor({ variables: { id: teamManage.actor.id, update } }));
    }

    await Promise.all(promises).then(() => {
      reset({}, { keepValues: true });
      socialForm.reset({ socials: socialForm.getValues('socials') });
    });
  });

  return (
    <BaseView
      header="Réseaux & contacts"
      innerClassName="pr-0"
      unscrollable={!isSmall}
      paddingMode="none"
      sidePanelButton={<ClockCounterClockwise className="h-7 w-7" />}
    >
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
            <TextInput name="email" error={formState.errors.email?.message} label="Email" />
            <TextInput
              name="website"
              error={formState.errors.website?.message}
              label="URL de votre site/page internet"
            />
          </div>
          <hr className="border-[var(--border-2)] my-10" />
          {/*           < heading="Prévisualisation de vos réseaux"> */}
          {/* <Profile actor={teamManage.actor} socials={socials} /> */}
          {/*           </> */}
        </form>
        <div className={clsx('h-full w-full flex flex-col gap-2', !isSmall && 'scrollbar overflow-y-scroll')}>
          <h3 className="text-base font-medium text-[var(--text-0)]">Réseaux sociaux</h3>
          <SocialsForm formMethods={socialForm} className="pr-[var(--px-content)]" />
        </div>
      </div>
    </BaseView>
  );
}
