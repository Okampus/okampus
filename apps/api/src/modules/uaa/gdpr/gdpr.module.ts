import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Blog } from '@create/blogs/blog.entity';
import { Content } from '@create/contents/entities/content.entity';
import { Thread } from '@create/threads/thread.entity';
import { Favorite } from '@interact/favorites/favorite.entity';
import { Reaction } from '@interact/reactions/reaction.entity';
import { Report } from '@interact/reports/report.entity';
import { Vote } from '@interact/votes/vote.entity';
import { Event } from '@plan/events/event.entity';
import { EventRegistration } from '@plan/registrations/registration.entity';
import { Announcement } from '@teams/announcements/announcement.entity';
import { TeamForm } from '@teams/forms/team-form.entity';
import { TeamMember } from '@teams/members/team-member.entity';
import { TeamMembershipRequest } from '@teams/requests/team-membership-request.entity';
import { Social } from '@teams/socials/social.entity';
import { BadgeUnlock } from '@uaa/badges/entities/badge-unlock.entity';
import { Statistics } from '@uaa/statistics/statistics.entity';
import { UserImage } from '@uaa/user-images/user-image.entity';
import { Attachment } from '@upload/attachments/attachment.entity';
import { InfoDoc } from '@upload/info-docs/info-doc.entity';
import { StudyDoc } from '@upload/study-docs/study-doc.entity';
import { TeamFile } from '@upload/team-files/team-file.entity';
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
      StudyDoc,
      TeamFile,
      Reaction,
      Report,
      Statistics,
      EventRegistration,
      Event,
      TeamForm,
      TeamMember,
      TeamMembershipRequest,
      Thread,
      UserImage,
      Vote,
    ]),
  ],
  controllers: [],
  providers: [GdprService],
  exports: [GdprService],
})
export class GdprModule {}
