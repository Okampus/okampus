import { NavigationContext, useManageOrg, useOrg, useTheme } from '@okampus/ui/hooks';
import { actorImageBareFragment, ActorImageType, getFragmentData, teamFragment } from '@okampus/shared/graphql';
import { Avatar, Bubble } from '@okampus/ui/atoms';
import { useContext } from 'react';

import type { ShortcutType } from '@okampus/shared/enums';
import type { LinkContext } from '#site/app/utils/get-link';
import type { MyInfoFragment } from '@okampus/shared/graphql';
import type { SubspaceType } from '@okampus/shared/types';

type SideShortcutProps = {
  shortcut: MyInfoFragment['shortcuts'][number];
  switchSubspace?: (shortcut: SubspaceType | ShortcutType, context?: LinkContext) => void;
};

export function SideShortcut({ shortcut, switchSubspace }: SideShortcutProps) {
  const { isSearching } = useContext(NavigationContext);
  const { org } = useOrg();
  const { manageOrg } = useManageOrg();
  const [theme] = useTheme();

  const actor = shortcut.targetActor;
  if (!actor || !actor.org || actor.org.__typename !== 'TeamModel') return null;

  const actorImages = actor.actorImages.map((img) => getFragmentData(actorImageBareFragment, img));
  const avatarSrc = actorImages.find((img) => img.type === ActorImageType.Avatar)?.image?.url;
  const avatarDarkSrc = actorImages.find((img) => img.type === ActorImageType.Avatar)?.image?.url;

  const targetOrg = getFragmentData(teamFragment, actor.org);

  return (
    <Bubble
      onClick={() => switchSubspace?.(shortcut.type, { Org: targetOrg.actor?.slug, ManageOrg: targetOrg?.actor?.slug })}
      selected={(org?.id === targetOrg.id || manageOrg?.id === targetOrg.id) && !isSearching}
    >
      <Avatar src={theme === 'light' ? avatarSrc : avatarDarkSrc} name={actor.name} size="full" rounded={35} />
    </Bubble>
  );
}
