import { EventValidationList } from './EventValidationList';
import { ApprovalStepManageView } from './ApprovalStepManageView';
import { ADMIN_EVENTS, ADMIN_EVENTS_ROUTES } from '@okampus/shared/consts';
import { TabsTopbarView } from '@okampus/ui/templates';

export function EventValidationView() {
  const menus = [
    {
      key: ADMIN_EVENTS_ROUTES.OVERVIEW,
      label: "Vue d'ensemble",
      element: EventValidationList,
    },
    {
      key: ADMIN_EVENTS_ROUTES.APPROVAL_STEPS,
      label: 'Étapes de validation',
      element: ApprovalStepManageView,
    },
  ];

  return <TabsTopbarView menus={menus} basePath={ADMIN_EVENTS} />;
}
