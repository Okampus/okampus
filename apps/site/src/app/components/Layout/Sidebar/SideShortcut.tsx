import { CurrentContext, NavigationContext, useCurrentContext, useTheme } from '@okampus/ui/hooks';
import {
  actorImageBareFragment,
  ActorImageType,
  getFragmentData,
  getTeamManageQuery,
  teamFragment,
  teamMembersFragment,
} from '@okampus/shared/graphql';
import { Avatar, Bubble } from '@okampus/ui/atoms';
import { SubspaceTypes } from '@okampus/shared/types';

import { useContext } from 'react';
import { useLazyQuery } from '@apollo/client';

import type { MyInfoFragment, ShortcutType } from '@okampus/shared/graphql';

type SideShortcutProps = {
  shortcut: MyInfoFragment['shortcuts'][number];
  switchSubspace: (subSpace: SubspaceTypes, shortcutKey?: ShortcutType, orgSlug?: string) => void;
};

export function SideShortcut({ shortcut, switchSubspace }: SideShortcutProps) {
  const { isSearching } = useContext(NavigationContext);
  const { setCurrentOrgId } = useContext(CurrentContext);
  const [{ org }, update] = useCurrentContext();
  // const { org, setOrg, isSearching } = useCurrent;

  const [theme] = useTheme();
  const [getManage] = useLazyQuery(getTeamManageQuery, {
    onCompleted: (data) => {
      const org = getFragmentData(teamMembersFragment, data.teamById);
      setCurrentOrgId(org.id);
      update();
      switchSubspace(SubspaceTypes.Manage, shortcut.type, org?.actor?.slug);
    },
  });

  const actor = shortcut.targetActor;
  if (!actor || !actor.org || actor.org.__typename !== 'TeamModel') return null;

  const actorImages = actor.actorImages.map((img) => getFragmentData(actorImageBareFragment, img));

  const avatarSrc = actorImages.find((img) => img.type === ActorImageType.Avatar)?.image?.url;
  const avatarDarkSrc = actorImages.find((img) => img.type === ActorImageType.Avatar)?.image?.url;

  const targetOrg = getFragmentData(teamFragment, actor.org);

  const onClick = () => {
    getManage({ variables: { id: targetOrg.id } });
  };

  return (
    <Bubble onClick={onClick} showBg={true} selected={org?.id === targetOrg.id && !isSearching}>
      <Avatar src={theme === 'light' ? avatarSrc : avatarDarkSrc} name={actor.name} size={16} rounded={35} />
      {/* <img src={theme === 'light' ? avatarSrc : avatarDarkSrc} /> */}
    </Bubble>
  );
}
