import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Announcement } from '../../announcements/announcement.entity';
import { BadgeUnlock } from '../../badges/entities/badge-unlock.entity';
import { Blog } from '../../blogs/blog.entity';
import { Content } from '../../contents/entities/content.entity';
import { Favorite } from '../../favorites/favorite.entity';
import { Attachment } from '../../files/attachments/attachment.entity';
import { InfoDoc } from '../../files/info-docs/info-doc.entity';
import { ProfileImage } from '../../files/profile-images/profile-image.entity';
import { StudyDoc } from '../../files/study-docs/study-doc.entity';
import { TeamFile } from '../../files/team-files/team-file.entity';
import { Reaction } from '../../reactions/reaction.entity';
import { Report } from '../../reports/report.entity';
import { BaseRepository } from '../../shared/lib/orm/base.repository';
import { Social } from '../../socials/social.entity';
import { Statistics } from '../../statistics/statistics.entity';
import { TeamEventRegistration } from '../../teams/event-registrations/team-event-registration.entity';
import { TeamEvent } from '../../teams/events/team-event.entity';
import { TeamForm } from '../../teams/forms/team-form.entity';
import { TeamMember } from '../../teams/members/team-member.entity';
import { TeamMembershipRequest } from '../../teams/requests/team-membership-request.entity';
import { Thread } from '../../threads/thread.entity';
import { Vote } from '../../votes/vote.entity';
import type { User } from '../user.entity';

@Injectable()
export class GdprService {
  // eslint-disable-next-line max-params
  constructor(
    /* eslint-disable max-len */
    @InjectRepository(Announcement) private readonly announcementRepository: BaseRepository<Announcement>,
    @InjectRepository(BadgeUnlock) private readonly badgeUnlockRepository: BaseRepository<BadgeUnlock>,
    @InjectRepository(Blog) private readonly blogRepository: BaseRepository<Blog>,
    @InjectRepository(Social) private readonly socialsRepository: BaseRepository<Social>,
    @InjectRepository(Content) private readonly contentRepository: BaseRepository<Content>,
    @InjectRepository(Favorite) private readonly favoriteRepository: BaseRepository<Favorite>,
    @InjectRepository(Attachment) private readonly attachmentRepository: BaseRepository<Attachment>,
    @InjectRepository(InfoDoc) private readonly infoDocRepository: BaseRepository<InfoDoc>,
    @InjectRepository(ProfileImage) private readonly profileImageRepository: BaseRepository<ProfileImage>,
    @InjectRepository(StudyDoc) private readonly studyDocRepository: BaseRepository<StudyDoc>,
    @InjectRepository(TeamFile) private readonly teamFileRepository: BaseRepository<TeamFile>,
    @InjectRepository(Reaction) private readonly reactionRepository: BaseRepository<Reaction>,
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    @InjectRepository(Statistics) private readonly statisticsRepository: BaseRepository<Statistics>,
    @InjectRepository(TeamEventRegistration) private readonly teamEventRegistrationRepository: BaseRepository<TeamEventRegistration>,
    @InjectRepository(TeamEvent) private readonly teamEventRepository: BaseRepository<TeamEvent>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest) private readonly teamMembershipRequestRepository: BaseRepository<TeamMembershipRequest>,
    @InjectRepository(Thread) private readonly threadRepository: BaseRepository<Thread>,
    @InjectRepository(Vote) private readonly voteRepository: BaseRepository<Vote>,
    /* eslint-enable max-len */
  ) {}

  public async getGdprDump(user: User): Promise<object> {
    /* eslint-disable no-multi-spaces */
    const announcements       = await this.announcementRepository.find({ createdBy: user });
    const unlockedBadges      = await this.badgeUnlockRepository.find({ user });
    const blogs               = await this.blogRepository.find({ post: { author: user } });
    const userContactAccounts = await this.socialsRepository.find({ user });
    const contents            = await this.contentRepository.find({ author: user });
    const favorites           = await this.favoriteRepository.find({ user });
    const attachments         = await this.attachmentRepository.find({ file: { user } });
    const infoDocs            = await this.infoDocRepository.find({ file: { user } });
    const profileImages       = await this.profileImageRepository.find({ file: { user } });
    const studyDocs           = await this.studyDocRepository.find({ file: { user } });
    const teamFiles           = await this.teamFileRepository.find({ file: { user } });
    const reactions           = await this.reactionRepository.find({ user });
    const reports             = await this.reportRepository.find({ user });
    const statistics          = await this.statisticsRepository.findOne({ user });
    const eventRegistrations  = await this.teamEventRegistrationRepository.find({ user });
    const createdEvents       = await this.teamEventRepository.find({ createdBy: user });
    const supervisedEvents    = await this.teamEventRepository.find({ supervisor: { user } });
    const forms               = await this.teamFormRepository.find({ createdBy: user });
    const memberships         = await this.teamMemberRepository.find({ user });
    const membershipRequests  = await this.teamMembershipRequestRepository.find({ user });
    const threads             = await this.threadRepository.find({ post: { author: user } });
    const votes               = await this.voteRepository.find({ user });
    /* eslint-enable no-multi-spaces */

    return {
      announcements,
      unlockedBadges,
      blogs,
      userContactAccounts,
      contents,
      favorites,
      attachments,
      infoDocs,
      profileImages,
      studyDocs,
      teamFiles,
      reactions,
      reports,
      statistics,
      eventRegistrations,
      createdEvents,
      supervisedEvents,
      forms,
      memberships,
      membershipRequests,
      threads,
      user,
      votes,
    };
  }
}
