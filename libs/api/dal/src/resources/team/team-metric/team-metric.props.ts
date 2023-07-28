import { InputType } from '@nestjs/graphql';
import type { TeamMetricType } from '@okampus/shared/enums';

@InputType()
export class TeamMetricProps {
  name!: string;
  metric!: TeamMetricType;
}
