import MultiStepPageLayout from '../../../_components/atoms/Layout/MultiStepPageLayout';
import type { TeamMinimalInfo } from '../../../../types/features/team.info';

export type OnboardTeamFormProps = {
  team: TeamMinimalInfo;
};
export default function OnboardTeamForm({ team }: OnboardTeamFormProps) {
  return <MultiStepPageLayout initialData={{}} steps={[]} onSubmit={() => {}} />;
  // TODO: bankInfo form, avatar, banner, joinForm, amount côtisation, link to pay cotisation, description, regular event, expected treasurer, expected members list
  // return
}
