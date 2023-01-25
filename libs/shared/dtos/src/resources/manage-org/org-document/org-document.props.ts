import { InputType } from '@nestjs/graphql';
import { OrgDocumentType } from '@okampus/shared/enums';

@InputType()
export class OrgDocumentProps {
  type!: OrgDocumentType;
}
