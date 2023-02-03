import { InputType } from '@nestjs/graphql';
import { OrgMetricType } from '@okampus/shared/enums';

@InputType()
export class OrgMetricProps {
  name!: string;
  metric!: OrgMetricType;
}
