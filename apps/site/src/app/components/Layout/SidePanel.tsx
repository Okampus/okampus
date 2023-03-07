import { getFragmentData, getUsersQuery, ScopeRole, userMembershipsFragment } from '@okampus/shared/graphql';
import { SubspaceType, tenantSubspaces } from '@okampus/shared/types';
import { NavigationContext, useMe, useOrg, useManageOrg, useUser } from '@okampus/ui/hooks';
import { LabeledSideUser } from '@okampus/ui/molecules';
import { isNotNull } from '@okampus/shared/utils';
import { getAvatar } from '@okampus/ui/utils';
import { TeamRoleCategory } from '@okampus/shared/enums';

import { useQuery } from '@apollo/client';
import { useContext } from 'react';

import type { ActorImageBase } from '@okampus/ui/utils';
import type { TeamMembersInfoFragment, GetUsersQuery } from '@okampus/shared/graphql';

const hasRoleCategory = (member: TeamMembersInfoFragment['members'][number], category: TeamRoleCategory) =>
  member.roles.some((role) => role.category === category);

const renderUsers = (users: { id: string; actor?: { actorImages: ActorImageBase[]; name: string } | null }[]) =>
  users
    .map((user) => {
      return user.actor ? (
        <li className="w-full">
          <LabeledSideUser
            name={user.actor.name}
            avatar={{ src: getAvatar(user.actor.actorImages), size: 14 }}
            id={user.id}
            key={user.id}
          />
        </li>
      ) : null;
    })
    .filter(isNotNull);

const renderCategories = (categories: [string, JSX.Element[]][]) => (
  <>
    {categories
      .filter(([, items]) => items.length > 0)
      .map(([category, users]) => (
        <ul className="mb-4">
          <div className="uppercase text-4 font-semibold text-sm font-title px-3 pb-1">
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
  const { org } = useOrg();
  const { manageOrg } = useManageOrg();
  const { user } = useUser();

  const { data: tenantUsers } = useQuery(getUsersQuery, {
    variables: { filter: { scopeRoles: [ScopeRole.Admin] } },
  });

  const topbarTitle = () => {
    if (tenantSubspaces.has(selected.subSpace) && tenant?.actor)
      return (
        <div>
          <div>Staff associatif</div>
          <div className="text-sm text-3">@{tenant.actor.slug}</div>
        </div>
      );
    if (selected.subSpace === SubspaceType.Org && org?.actor)
      return (
        <div>
          <div>Membres de l'équipe</div>
          <div className="text-sm text-3">@{org.actor.slug}</div>
        </div>
      );
    if (selected.subSpace === SubspaceType.Manage && manageOrg?.actor)
      return (
        <div>
          <div>Membres de l'équipe</div>
          <div className="text-sm text-3">@{manageOrg.actor.slug}</div>
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
    return null;
  };

  const sidePanelDetails = () => {
    if (tenantSubspaces.has(selected.subSpace) && tenant?.actor) {
      const getUsers = (users?: GetUsersQuery['users']) =>
        users?.edges ? renderUsers(users.edges.map((edge) => getFragmentData(userMembershipsFragment, edge.node))) : [];

      return renderCategories([['Administrateurs', getUsers(tenantUsers?.users)]]);
    }

    const currentOrg = org ?? manageOrg;
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
    return null;
  };

  return (
    <nav className="hidden lg:flex flex-col h-full w-sidepanel bg-0 text-0 overflow-hidden">
      <div className="flex gap-item items-center h-[var(--topbar-height)] font-title text-xl px-[calc(var(--padding-inner)*4)] font-semibold shrink-0">
        <div>{topbarTitle()}</div>
      </div>
      <ul className="pt-[calc(var(--padding-inner)*2)] scrollbar px-[calc(var(--padding-inner)*3)]">
        {sidePanelDetails()}
      </ul>
    </nav>
  );
}
