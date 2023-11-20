import MultiStepPageLayout from '../../../_components/atoms/Layout/MultiStepPageLayout';
import type { TeamMinimal } from '../../../../types/prisma/Team/team-minimal';

export type OnboardTeamFormProps = {
  team: TeamMinimal;
};
export default function OnboardTeamForm({ team }: OnboardTeamFormProps) {
  return <MultiStepPageLayout initialData={{}} steps={[]} onSubmit={() => {}} />;
  // TODO: bankAccountInfo form, avatar, banner, joinForm, amount côtisation, link to pay cotisation, description, regular event, expected treasurer, expected members list
  // return
}
