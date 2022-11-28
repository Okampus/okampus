import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Blog } from '@modules/create/blogs/blog.entity';
import { Content } from '@modules/create/contents/entities/content.entity';
import { Thread } from '@modules/create/threads/thread.entity';
import { Favorite } from '@modules/interact/favorites/favorite.entity';
import { Reaction } from '@modules/interact/reactions/reaction.entity';
import { Report } from '@modules/interact/reports/report.entity';
import { Vote } from '@modules/interact/votes/vote.entity';
import { Announcement } from '@modules/org/teams/announcements/announcement.entity';
import { TeamForm } from '@modules/org/teams/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { TeamMembershipRequest } from '@modules/org/teams/requests/team-membership-request.entity';
import { Social } from '@modules/org/teams/socials/social.entity';
import { Event } from '@modules/plan/events/event.entity';
import { EventRegistration } from '@modules/plan/registrations/registration.entity';
import { Attachment } from '@modules/upload/attachments/attachment.entity';
import { InfoDoc } from '@modules/upload/info-docs/info-doc.entity';
import { StudyDoc } from '@modules/upload/study-docs/study-doc.entity';
import { TeamFile } from '@modules/upload/team-files/team-file.entity';
import { BadgeUnlock } from '../badges/entities/badge-unlock.entity';
import { Statistics } from '../statistics/statistics.entity';
import { UserImage } from '../user-images/user-image.entity';
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
