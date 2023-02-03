import { InputType, IntersectionType } from '@nestjs/graphql';
import type {} from '@nestjs/common';
import { OrgDocumentProps } from './org-document.props';
import { DocumentProps } from '../../ugc/document/document.props';

@InputType()
export class CreateOrgDocumentDto extends IntersectionType(DocumentProps, OrgDocumentProps) {}
