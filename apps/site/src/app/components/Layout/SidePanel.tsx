import { smallHideClassName } from './Sidebar';

import { SubspaceType, TeamRoleCategory } from '@okampus/shared/enums';
import { getFragmentData, getUsersQuery, ScopeRole, userMembershipsFragment } from '@okampus/shared/graphql';
import { isNotNull } from '@okampus/shared/utils';

import { NavigationContext, useMe, useTeam, useUser, useTeamManage } from '@okampus/ui/hooks';
import { LabeledSideUser } from '@okampus/ui/molecules';
import { getAvatar } from '@okampus/ui/utils';

import { useQuery } from '@apollo/client';
import { clsx } from 'clsx';
import { useContext } from 'react';

import type { TeamMembersInfoFragment, GetUsersQuery } from '@okampus/shared/graphql';
import type { ActorImageBase } from '@okampus/ui/utils';

const hasRoleCategory = (member: TeamMembersInfoFragment['members'][number], category: TeamRoleCategory) =>
  member.roles.some((role) => role.category === category);

const renderUsers = (users: { id: string; actor?: { actorImages: ActorImageBase[]; name: string } | null }[]) =>
  users
    .map((user) => {
      return user.actor ? (
        <li key={user.id} className="w-full">
          <LabeledSideUser id={user.id} name={user.actor.name} avatar={{ src: getAvatar(user.actor.actorImages) }} />
        </li>
      ) : null;
    })
    .filter(isNotNull);

const renderCategories = (categories: [string, JSX.Element[]][]) => (
  <>
    {categories
      .filter(([, items]) => items.length > 0)
      .map(([category, users]) => (
        <ul className="mb-4" key={category}>
          <div className={clsx('uppercase text-4 font-semibold text-sm font-title px-2 pb-1', smallHideClassName)}>
            {category} — {users.length}
          </div>
          {users}
        </ul>
      ))}
  </>
);

export function SidePanel() {
  const { selected, tenant } = useContext(NavigationContext);

  const { me } = useMe();
  const { team } = useTeam();
  const { teamManage } = useTeamManage();
  const { user } = useUser();

  const { data: tenantUsers } = useQuery(getUsersQuery, {
    variables: { filter: { scopeRoles: [ScopeRole.Admin] } },
  });

  const topbarTitle = () => {
    if (selected.subSpace === SubspaceType.Org && team?.actor)
      return (
        <div>
          <div>Membres de l'équipe</div>
          <div className="text-sm text-3">@{team.actor.slug}</div>
        </div>
      );
    if (selected.subSpace === SubspaceType.Manage && teamManage?.actor)
      return (
        <div>
          <div>Membres de l'équipe</div>
          <div className="text-sm text-3">@{teamManage.actor.slug}</div>
        </div>
      );
    if (selected.subSpace === SubspaceType.User && user?.actor)
      return (
        <div>
          <div>Profil public</div>
          <div className="text-sm text-3">@{user.actor.slug}</div>
        </div>
      );
    if (selected.subSpace === SubspaceType.Me && me?.actor)
      return (
        <div>
          <div>Mon profil</div>
          <div className="text-sm text-3">@{me.actor.slug}</div>
        </div>
      );

    if (tenant?.actor)
      return (
        <div>
          <div>Staff associatif</div>
          <div className="text-sm text-3">@{tenant.actor.slug}</div>
        </div>
      );

    return null;
  };

  const sidePanelDetails = () => {
    const currentOrg = team ?? teamManage;
    if ((selected.subSpace === SubspaceType.Org || selected.subSpace === SubspaceType.Manage) && currentOrg) {
      const directors = currentOrg.members.filter((member) => hasRoleCategory(member, TeamRoleCategory.Directors));
      const managers = currentOrg.members.filter(
        (member) => hasRoleCategory(member, TeamRoleCategory.Managers) && !directors.includes(member)
      );

      const members = currentOrg.members.filter((member) => !directors.includes(member) && !managers.includes(member));
      const getUsers = (members: TeamMembersInfoFragment['members']) =>
        renderUsers(members.map((member) => member.user).filter(isNotNull));

      return renderCategories([
        [currentOrg.directorsCategoryName, getUsers(directors)],
        [currentOrg.managersCategoryName, getUsers(managers)],
        [currentOrg.membersCategoryName, getUsers(members)],
      ]);
    }

    if (tenant?.actor) {
      const getUsers = (users?: GetUsersQuery['users']) =>
        users?.edges ? renderUsers(users.edges.map((edge) => getFragmentData(userMembershipsFragment, edge.node))) : [];

      return renderCategories([['Administrateurs', getUsers(tenantUsers?.users)]]);
    }

    return null;
  };

  return (
    <nav className="flex flex-col h-full w-sidebar bg-main text-0 overflow-hidden border-l border-color-3">
      <div
        className={clsx(
          'flex gap-item items-center h-[var(--topbar-height)] font-title text-xl px-4 font-semibold shrink-0',
          smallHideClassName
        )}
      >
        <div>{topbarTitle()}</div>
      </div>
      <ul className="p-3 scrollbar">{sidePanelDetails()}</ul>
    </nav>
  );
}
