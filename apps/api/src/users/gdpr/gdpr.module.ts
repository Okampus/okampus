import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { Announcement } from '../../announcements/announcement.entity';
import { BadgeUnlock } from '../../badges/entities/badge-unlock.entity';
import { Blog } from '../../blogs/blog.entity';
import { UserContactAccount } from '../../contacts/entities/user-contact-account.entity';
import { Content } from '../../contents/entities/content.entity';
import { Favorite } from '../../favorites/favorite.entity';
import { Attachment } from '../../files/attachments/attachment.entity';
import { InfoDoc } from '../../files/info-docs/info-doc.entity';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { StudyDoc } from '../../files/study-docs/study-doc.entity';
import { TeamFile } from '../../files/team-files/team-file.entity';
import { Reaction } from '../../reactions/reaction.entity';
import { Report } from '../../reports/report.entity';
import { Statistics } from '../../statistics/statistics.entity';
import { TeamEventRegistration } from '../../teams/event-registrations/team-event-registration.entity';
import { TeamEvent } from '../../teams/events/team-event.entity';
import { TeamForm } from '../../teams/forms/team-form.entity';
import { TeamMember } from '../../teams/members/team-member.entity';
import { TeamMembershipRequest } from '../../teams/requests/team-membership-request.entity';
import { Thread } from '../../threads/thread.entity';
import { Vote } from '../../votes/vote.entity';
import { GdprService } from './gdpr.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([
      Announcement,
      BadgeUnlock,
      Blog,
      UserContactAccount,
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
