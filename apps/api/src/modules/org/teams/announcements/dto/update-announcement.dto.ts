import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from '@teams/announcements/dto/create-announcement.dto';

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
