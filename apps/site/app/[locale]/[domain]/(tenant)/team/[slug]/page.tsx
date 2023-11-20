import BlockGrid from '../../../../../_components/atoms/Container/BlockGrid';
import Section from '../../../../../_components/atoms/Container/Section';
import AvatarImage from '../../../../../_components/atoms/Image/AvatarImage';
import IText from '../../../../../_components/atoms/Inline/IText';
import ILinkList from '../../../../../_components/atoms/Inline/ILinkList';
import BoxItem from '../../../../../_components/atoms/Item/ChoiceItem';
import MissionItem from '../../../../../_components/atoms/Item/MissionItem';
import TeamSidePanel from '../../../../../_components/layouts/SidePanel/TeamSidePanel';

import BaseView from '../../../../../_components/templates/BaseView';
// import PanelView from '../../../../../_components/templates/PanelView';

import ManagerCard from '../../../../../_views/Member/ManagerCard';
import PoleCard from '../../../../../_views/PoleCard';
import TeamSidebar from '../../../../../_views/Team/TeamSidebar';
import TeamHeader from '../../../../../_views/Team/TeamHeader';

import prisma from '../../../../../../database/prisma/db';

import { teamDetails } from '../../../../../../types/prisma/Team/team-details';
import { teamMemberMinimal } from '../../../../../../types/prisma/TeamMember/team-member-minimal';
import { missionMinimal } from '../../../../../../types/prisma/Mission/mission-minimal';

import { isNotNull } from '@okampus/shared/utils';
import { TeamRoleType } from '@prisma/client';

import Link from 'next/link';
import { notFound } from 'next/navigation';

import type { DomainParams, DomainSlugParams } from '../../../../../params.type';

export async function generateStaticParams({ params }: DomainParams) {
  const teams = await prisma.team.findMany({
    where: { tenantScope: { domain: params.domain } },
    select: { slug: true },
  });
  return teams;
}

export default async function TeamPage({ params }: DomainSlugParams) {
  // const { data: me } = useMe();
  // // const team = useTeam(params.slug);;
  // const { openBottomSheet, closeBottomSheet } = useBottomSheet();

  // const where = { eventOrganizes: { teamId: { _eq: team?.id } }, state: { _eq: EventState.Published } };
  // const variables = { where, orderBy: [{ start: OrderBy.Desc }], limit: 3 };

  // const { data } = useQueryAndSubscribe<GetEventsQuery, GetEventsQueryVariables>({ query: GetTeamDocument, variables });

  const team = await prisma.team.findFirst({
    where: { slug: params.slug, tenantScope: { domain: params.domain } },
    select: teamDetails.select,
  });

  // const [insertTeamJoin] = useInsertTeamJoinMutation();

  if (!team) notFound();

  const missions = await prisma.mission.findMany({
    where: {
      // NOT: { teamRoleId: null },
      team: { slug: params.slug },
    }, // TODO: better where
    select: missionMinimal.select,
    take: 4,
  });

  const similarTeams = await prisma.team.findMany({
    where: {
      // NOT: { teamRoleId: null },
      actor: { actorTags: { some: { tag: { slug: { in: team.actor.actorTags.map(({ tag }) => tag.slug) } } } } },
    }, // TODO: better where
    select: {
      slug: true,
      actor: { select: { name: true, avatar: true, type: true } },
      _count: { select: { teamMembers: true } },
    },
    take: 6,
  });

  const directors = await prisma.teamMember.findMany({
    where: { teamId: team.id, teamMemberRoles: { some: { teamRole: { type: TeamRoleType.DirectorRole } } } },
    select: teamMemberMinimal.select,
  });

  const secretary = team.teamMembers.find((member) =>
    member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.Secretary),
  );
  const president = team.teamMembers.find((member) =>
    member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.President),
  );
  const treasurer = team.teamMembers.find((member) =>
    member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.Treasurer),
  );

  // const events = data?.event;
  // const memberRole = team.teamRoles.find((teamRole) => !teamRole.type);

  // const isMember = me.teamMemberships.some((member) => member.team.id === team.id);
  // const isJoining = me.teamJoins.some((join) => join.team.id === team.id);

  // let action: ActionCTA;
  // let type = ActionType.Action;
  // let label = `Gérer ${team.actor.name}`;

  // if (isMember) {
  //   action = `/manage/team/${team.slug}`;
  // } else if (isJoining) {
  //   type = ActionType.Info;
  //   label = 'Adhésion en attente...';
  // } else if (team.joinForm) {
  //   const form = team.joinForm;
  //   type = ActionType.Primary;
  //   label = 'Adhérer';
  //   action = () =>
  //     openBottomSheet({
  //       node: (
  //         <FormRenderer
  //           form={form}
  //           name={`Formulaire d'adhésion / ${team.actor.name}`}
  //           onSubmit={(data) =>
  //             memberRole
  //               ? insertTeamJoin({
  //                   variables: {
  //                     object: {
  //                       teamId: team.id,
  //                       joinedById: me.id,
  //                       joinFormSubmission: { data: { submission: data } },
  //                     },
  //                   },
  //                   onCompleted: ({ insertTeamJoinOne }) => {
  //                     if (!insertTeamJoinOne) return;
  //                     closeBottomSheet();
  //                     setNotification({ message: 'Votre demande a été envoyée', type: ToastType.Success });
  //                     updateFragment<MeInfo>({
  //                       __typename: 'Me',
  //                       fragment: MeFragment,
  //                       where: { slug: me.slug },
  //                       update: (user) =>
  //                         produce(user, (draft) => {
  //                           draft.teamJoins.push(insertTeamJoinOne);
  //                         }),
  //                     });
  //                   },
  //                 })
  //               : setNotification({
  //                   message: `${team.actor.name} n'accepte pas de nouveaux membres pour le moment !`,
  //                   type: ToastType.Error,
  //                 })
  //           }
  //         />
  //       ),
  //     });
  // } else {
  //   type = ActionType.Info;
  //   label = "Ce groupe n'accepte pas de nouveaux membres !";
  // }

  const items = [
    {
      title: 'Statut',
      children: (
        <div className="inline text-[var(--text-2)]">
          {team.parent ? (
            <>
              Club de{' '}
              <Link className="hover:underline" href={`/team/${team.parent.slug}`}>
                {team.parent.actor.name}
              </Link>
            </>
          ) : (
            'Association indépendante'
          )}
        </div>
      ),
    },
    {
      title: 'Catégories',
      children: (
        <ILinkList links={team.actor.actorTags.map(({ tag }) => ({ href: `/teams/${tag.slug}`, label: tag.name }))} />
      ),
    },
    {
      title: 'Campus',
      children: (
        <ILinkList
          links={team.actor.actorClusters.map(({ tenantLocationCluster: cluster }) => ({
            href: `/cluster/${cluster.slug}`,
            label: cluster.name,
          }))}
        />
      ),
    },
  ];

  const managerRoles = team.teamRoles.filter((teamRole) => teamRole.type === TeamRoleType.ManagerRole);

  return (
    <>
      <TeamSidebar team={team} />
      <BaseView contentMode="centered-6xl" hasCta={true} header="Présentation de l'association">
        <TeamHeader team={team} />
        <IText text={team.actor.status} className="text-2 line-clamp-2 mb-8" />
        <BlockGrid blocks={items} className="mb-8" />
        <Section title="Bureau">
          <div className="grid grid-cols-3 lg-max:grid-cols-1 gap-12">
            <ManagerCard
              title="Président"
              data={
                president?.user ??
                (team.expectingPresidentEmail ? { email: team.expectingPresidentEmail } : 'Poste à pourvoir')
              }
            />
            <ManagerCard
              title="Secrétaire"
              data={
                secretary?.user ??
                (team.expectingSecretaryEmail ? { email: team.expectingSecretaryEmail } : 'Poste à pourvoir')
              }
            />
            <ManagerCard
              title="Trésorier"
              data={
                treasurer?.user ??
                (team.expectingTreasurerEmail ? { email: team.expectingTreasurerEmail } : 'Poste à pourvoir')
              }
            />
          </div>
        </Section>
        <Section title="Pôles">
          <div className="grid md:grid-cols-4 grid-cols-1 gap-8">
            <PoleCard
              href="/team/pole/core"
              name="Bureau"
              managers={[president, secretary, treasurer].filter(isNotNull)}
              members={[...directors, president, secretary, treasurer].filter(isNotNull)}
              memberCount={managerRoles.length}
            />
            {managerRoles.map((role) => {
              const members = team.teamMembers.filter((member) =>
                member.teamMemberRoles.some(({ teamRole }) => teamRole.id === role.id),
              );
              return (
                <PoleCard
                  key={role.id}
                  href={`/team/pole/${role.slug}`}
                  name={role.name}
                  managers={role.manager ? [role.manager] : []}
                  members={members.filter(
                    (member) =>
                      !member.teamMemberRoles.some(
                        (memberRole) => memberRole.teamRole.type === TeamRoleType.DirectorRole,
                      ),
                  )}
                  memberCount={members.length}
                />
              );
            })}
          </div>
        </Section>
        {missions.length > 0 && (
          <Section
            title="Postes à pourvoir & missions"
            link={{ href: `/team/${params.slug}/jobs`, label: `Voir toutes les missions (${team._count.missions})` }}
          >
            {missions.map((mission) => (
              <BoxItem key={mission.id} action={`/team/${params.slug}`}>
                <MissionItem actor={team.actor} name={mission.teamRole?.name ?? mission.name} />
              </BoxItem>
            ))}
          </Section>
        )}
        <Section
          title="Découvrez des associations similaires"
          link={{ href: '/teams', label: `Voir toutes les associations` }}
        >
          <div className="grid md:grid-cols-3 grid-cols-1 gap-10">
            {similarTeams.map((team) => (
              <div key={team.slug} className="relative flex items-center gap-3 w-full">
                <AvatarImage actor={team.actor} size={48} />
                <div className="flex flex-col w-full">
                  <Link href={`/team/${team.slug}`} className="text-1 card-link font-medium line-clamp-1">
                    {team.actor.name}
                  </Link>
                  <div className="text-2 text-sm font-thin">{team._count.teamMembers} membres</div>
                </div>
              </div>
            ))}
          </div>
        </Section>
      </BaseView>
      <TeamSidePanel team={team} />
    </>
  );
}
