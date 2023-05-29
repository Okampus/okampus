import { ME_ROUTE, ME_ROUTES } from '@okampus/shared/consts';
import { ActionType } from '@okampus/shared/types';
import { useCurrentUser } from '@okampus/ui/hooks';
import { ActionButton } from '@okampus/ui/molecules';

import type { UserWithMembershipsInfo } from '@okampus/shared/graphql';

export type UserSidePanelProps = { user: UserWithMembershipsInfo };
export function UserSidePanel({ user }: UserSidePanelProps) {
  const { currentUser } = useCurrentUser();

  return (
    <div>
      {currentUser?.id === user.id ? (
        <ActionButton
          action={{
            type: ActionType.Action,
            label: 'Gérer mon profil',
            linkOrActionOrMenu: `${ME_ROUTE}/${ME_ROUTES.PROFILE}`,
          }}
        />
      ) : (
        <ActionButton
          action={{
            type: ActionType.Action,
            label: 'Suivre',
            linkOrActionOrMenu: () => console.log('Suivre'),
          }}
        />
      )}
      <div className="label">À propos</div>
      <div className="text-2">{user.individualById?.actor?.bio}</div>
    </div>
  );
}
