import { PartialType } from '@nestjs/mapped-types';
import { CreateAnnouncementDto } from '@modules/manage/announcements/dto/create-announcement.dto';

export class UpdateAnnouncementDto extends PartialType(CreateAnnouncementDto) {}
