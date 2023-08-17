'use client';

import SideBarTitle from './SidebarTitle';
import SideBar from '../SideBar';
import UserLabeled from '../../molecules/Labeled/UserLabeled';
import SkeletonSidebar from '../../atoms/Skeleton/SkeletonSidebar';

import { useGetUsersQuery } from '@okampus/shared/graphql';
import type { UserMinimalInfo } from '../../../types/features/user.info';

export type UserSideBarProps = { user: UserMinimalInfo };
export default function UserSideBar({ user }: UserSideBarProps) {
  const where = { individual: { actor: { slug: { _neq: user.individual.actor.slug } } } };
  const { data } = useGetUsersQuery({ variables: { where, limit: 10 } });

  return data ? (
    <SideBar>
      <SideBarTitle>Annuaire associatif</SideBarTitle>
      <ul className="px-2 flex flex-col gap-1">
        <li>
          <UserLabeled user={user} full={true} className="bg-2-hover rounded-lg p-2 w-full" />
        </li>
        {data.user.map((user) => (
          <li key={user.id}>
            <UserLabeled user={user} full={true} className="bg-2-hover rounded-lg p-2 w-full" />
          </li>
        ))}
      </ul>
    </SideBar>
  ) : (
    <SkeletonSidebar />
  );
}
