import { InputType } from '@nestjs/graphql';
import type {} from '@nestjs/common';
import { DocumentProps } from './document.props';

@InputType()
export class CreateDocumentDto extends DocumentProps {}
