'use client';

import Profile from './Profile';
import SidePanel from '../SidePanel';
import UserLabeled from '../../molecules/Labeled/UserLabeled';
import SimpleList from '../../molecules/List/SimpleList';
import { useTeam } from '../../../_context/navigation';

import { TeamRoleType } from '@prisma/client';
import { usePathname } from 'next/navigation';

import clsx from 'clsx';
import type { TeamMemberMinimalInfo } from '../../../../types/features/team-member.info';

const isDirector = (type: string | null) =>
  type === TeamRoleType.President || type === TeamRoleType.Secretary || type === TeamRoleType.Treasurer;

const renderCategories = (categories: [string, TeamMemberMinimalInfo[]][]) => (
  <>
    {categories
      .filter(([, items]) => items.length > 0)
      .map(([category, teamMembers]) => (
        <SimpleList
          className="mb-4"
          headingClassName="px-2"
          groupClassName="flex flex-col"
          heading={`${category} — ${teamMembers.length}`}
          key={category}
        >
          {teamMembers.map(({ user }) => (
            <UserLabeled
              key={user.id.toString()}
              user={user}
              full={true}
              className="bg-2-hover rounded-lg p-2 w-full"
            />
          ))}
        </SimpleList>
      ))}
  </>
);

export type TeamSidePanelProps = { slug: string };
export default function TeamSidePanel({ slug }: TeamSidePanelProps) {
  const pathname = usePathname();
  const { team } = useTeam(slug);

  if (!team) return null;

  const directors: typeof team.teamMembers = [];
  const managers: typeof team.teamMembers = [];
  const members: typeof team.teamMembers = [];

  for (const member of team.teamMembers) {
    if (member.teamMemberRoles.some(({ teamRole }) => isDirector(teamRole.type))) directors.push(member);
    else if (member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.ManagerRole))
      managers.push(member);
    else members.push(member);
  }

  if (!team.actor?.socials) return null;

  const showProfile = pathname !== `/team/${team.slug}`;

  return (
    <SidePanel>
      {showProfile && <Profile actor={team.actor} socials={team.actor.socials} />}
      <section className={clsx('pt-[var(--py-content)] px-3', showProfile && 'border-t border-[var(--border-1)]')}>
        {renderCategories([
          [team.directorsCategoryName || 'Directeurs', directors],
          [team.managersCategoryName || 'Gestionnaires', managers],
          [team.membersCategoryName || 'Membres', members],
        ])}
      </section>
    </SidePanel>
  );
}
