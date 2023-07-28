'use client';

import Profile from './Profile';
import SidePanel from '../SidePanel';
import UserLabeled from '../../molecules/Labeled/UserLabeled';
import GroupItem from '../../atoms/Item/GroupItem';
import { useTeam } from '../../../context/navigation';

import { RoleCategory } from '@okampus/shared/enums';
import { usePathname } from 'next/navigation';
import type { TeamMemberWithUser } from '@okampus/shared/graphql';

const renderCategories = (categories: [string, TeamMemberWithUser[]][]) => (
  <>
    {categories
      .filter(([, items]) => items.length > 0)
      .map(([category, teamMembers]) => (
        <GroupItem
          className="mb-4"
          headingClassName="px-2"
          groupClassName="flex flex-col"
          heading={`${category} — ${teamMembers.length}`}
          key={category}
        >
          {teamMembers.map((teamMember) => (
            <UserLabeled
              key={teamMember.user.id}
              individual={teamMember.user.individual}
              id={teamMember.user.id}
              full={true}
              className="bg-2-hover rounded-lg p-2 w-full"
            />
          ))}
        </GroupItem>
      ))}
  </>
);

export type TeamSidePanelProps = { slug: string };
export default function TeamSidePanel({ slug }: TeamSidePanelProps) {
  const pathname = usePathname();
  const { team } = useTeam(slug);

  if (!team) return null;

  const directors: typeof team.teamMembers[number][] = [];
  const managers: typeof team.teamMembers[number][] = [];
  const members: typeof team.teamMembers[number][] = [];

  for (const member of team.teamMembers) {
    if (member.teamMemberRoles.some(({ role }) => role.category === RoleCategory.Directors)) directors.push(member);
    else if (member.teamMemberRoles.some(({ role }) => role.category === RoleCategory.Managers)) managers.push(member);
    else members.push(member);
  }

  if (!team.actor || !team.actor.socials) return null;

  return (
    <SidePanel>
      {pathname !== `/team/${team.actor.slug}` && (
        <Profile type="team" actor={team.actor} socials={team.actor.socials} />
      )}
      <section className="pt-[var(--py-content)] px-3">
        {renderCategories([
          [team.directorsCategoryName || 'Directeurs', directors],
          [team.managersCategoryName || 'Gestionnaires', managers],
          [team.membersCategoryName || 'Membres', members],
        ])}
      </section>
    </SidePanel>
  );
}
