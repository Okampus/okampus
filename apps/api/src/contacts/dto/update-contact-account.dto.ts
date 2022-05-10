import { PartialType } from '@nestjs/mapped-types';
import { CreateContactAccountDto } from './create-contact-account.dto';

export class UpdateContactAccountDto extends PartialType(CreateContactAccountDto) {}
