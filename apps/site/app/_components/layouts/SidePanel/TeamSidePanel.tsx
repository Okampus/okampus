// import Profile from './Profile';
import Sidepanel from '../Sidepanel';
import UserLabeled from '../../molecules/Labeled/UserLabeled';

import { ListColumn } from '../../atoms/Container/ListColumn';
import { TeamRoleType } from '@prisma/client';

import type { TeamDetails } from '../../../../types/prisma/Team/team-details';

const isDirector = (type: string | null) =>
  type === TeamRoleType.President || type === TeamRoleType.Secretary || type === TeamRoleType.Treasurer;

export type TeamSidePanelProps = { team: TeamDetails };
export default function TeamSidePanel({ team }: TeamSidePanelProps) {
  const directors: typeof team.teamMembers = [];
  const managers: typeof team.teamMembers = [];
  const members: typeof team.teamMembers = [];

  for (const member of team.teamMembers) {
    if (member.teamMemberRoles.some(({ teamRole }) => isDirector(teamRole.type))) directors.push(member);
    else if (member.teamMemberRoles.some(({ teamRole }) => teamRole.type === TeamRoleType.ManagerRole))
      managers.push(member);
    else members.push(member);
  }

  const memberCategories = [
    [team.directorsCategoryName || 'Directeurs', directors],
    [team.managersCategoryName || 'Gestionnaires', managers],
    [team.membersCategoryName || 'Membres', members],
  ] as const;

  return (
    <Sidepanel>
      {/* <Profile actor={team.actor} socials={team.actor.socials} /> */}
      <section className="px-3 py-5">
        {memberCategories
          .filter(([, items]) => items.length > 0)
          .map(([category, teamMembers]) => (
            <ListColumn
              key={category}
              title={category}
              items={teamMembers.map(({ user }) => ({
                children: <UserLabeled key={user.id} user={user} full={true} className="bg-2-hover p-2 w-full" />,
              }))}
            />
          ))}
      </section>
    </Sidepanel>
  );
}
