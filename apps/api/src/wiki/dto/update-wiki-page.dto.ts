import { PartialType } from '@nestjs/mapped-types';
import { CreateWikiPageDto } from './create-wiki-page.dto';

export class UpdateWikiPageDto extends PartialType(CreateWikiPageDto) {}
