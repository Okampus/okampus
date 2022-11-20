import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Announcement } from '../../../announcements/announcement.entity';
import { Blog } from '../../../create/comm/blogs/blog.entity';
import { Thread } from '../../../create/comm/threads/thread.entity';
import { Content } from '../../../create/contents/entities/content.entity';
import { Favorite } from '../../../create/interact/favorites/favorite.entity';
import { Reaction } from '../../../create/interact/reactions/reaction.entity';
import { Report } from '../../../create/interact/reports/report.entity';
import { Vote } from '../../../create/interact/votes/vote.entity';
import { Attachment } from '../../../files/attachments/attachment.entity';
import { InfoDoc } from '../../../files/info-docs/info-doc.entity';
import { ProfileImage } from '../../../files/profile-images/profile-image.entity';
import { StudyDoc } from '../../../files/study-docs/study-doc.entity';
import { TeamFile } from '../../../files/team-files/team-file.entity';
import { TeamEventRegistration } from '../../../org/teams/event-registrations/team-event-registration.entity';
import { TeamEvent } from '../../../org/teams/events/team-event.entity';
import { TeamForm } from '../../../org/teams/forms/team-form.entity';
import { TeamMember } from '../../../org/teams/members/team-member.entity';
import { TeamMembershipRequest } from '../../../org/teams/requests/team-membership-request.entity';
import { Social } from '../../../socials/social.entity';
import { BadgeUnlock } from '../../badges/entities/badge-unlock.entity';
import { Statistics } from '../../statistics/statistics.entity';
import { GdprService } from './gdpr.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Announcement,
      BadgeUnlock,
      Blog,
      Social,
      Content,
      Favorite,
      Attachment,
      InfoDoc,
      ProfileImage,
      StudyDoc,
      TeamFile,
      Reaction,
      Report,
      Statistics,
      TeamEventRegistration,
      TeamEvent,
      TeamForm,
      TeamMember,
      TeamMembershipRequest,
      Thread,
      Vote,
    ]),
  ],
  controllers: [],
  providers: [GdprService],
  exports: [GdprService],
})
export class GdprModule {}
