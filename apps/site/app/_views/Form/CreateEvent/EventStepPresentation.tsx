import TextAreaInput from '../../../_components/molecules/Input/Uncontrolled/String/TextAreaInput';

import type { TeamWithProjects } from '../../../../types/prisma/Team/team-with-projects';
import type { FormStepContext } from '../../../_components/templates/MultiStepFormView';

export default function EventStepPresentation({ context, goToNextStep }: FormStepContext<TeamWithProjects>) {
  return (
    <div>
      <TextAreaInput label="Description" name="description" />
      {/* TODO: agenda, faq */}
    </div>
  );
}
