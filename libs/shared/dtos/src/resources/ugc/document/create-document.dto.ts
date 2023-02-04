import { DocumentProps } from './document.props';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateDocumentDto extends DocumentProps {}
