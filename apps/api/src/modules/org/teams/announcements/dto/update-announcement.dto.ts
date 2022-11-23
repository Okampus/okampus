import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from '@modules/org/teams/announcements/dto/create-announcement.dto';

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
