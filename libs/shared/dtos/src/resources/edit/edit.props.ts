import { InputType } from '@nestjs/graphql';
import type { JSONObject } from '@okampus/shared/types';

@InputType()
export class EditProps {
  addedDiff!: JSONObject | null;
}
