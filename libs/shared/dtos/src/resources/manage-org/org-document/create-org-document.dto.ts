import { OrgDocumentProps } from './org-document.props';
import { DocumentProps } from '../../ugc/document/document.props';
import { InputType, IntersectionType } from '@nestjs/graphql';

@InputType()
export class CreateOrgDocumentDto extends IntersectionType(DocumentProps, OrgDocumentProps) {}
