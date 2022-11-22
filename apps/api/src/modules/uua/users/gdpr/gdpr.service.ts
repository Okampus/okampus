import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import { Blog } from '@modules/create/blogs/blog.entity';
import { Content } from '@modules/create/contents/entities/content.entity';
import { Thread } from '@modules/create/threads/thread.entity';
import { Favorite } from '@modules/interact/favorites/favorite.entity';
import { Reaction } from '@modules/interact/reactions/reaction.entity';
import { Report } from '@modules/interact/reports/report.entity';
import { Vote } from '@modules/interact/votes/vote.entity';
import { Announcement } from '@modules/manage/announcements/announcement.entity';
import { TeamForm } from '@modules/manage/forms/team-form.entity';
import { TeamMember } from '@modules/org/teams/members/team-member.entity';
import { TeamMembershipRequest } from '@modules/org/teams/requests/team-membership-request.entity';
import { Social } from '@modules/org/teams/socials/social.entity';
import { TeamEventRegistration } from '@modules/plan/event-registrations/team-event-registration.entity';
import { TeamEvent } from '@modules/plan/events/team-event.entity';
import { Attachment } from '@modules/store/attachments/attachment.entity';
import { InfoDoc } from '@modules/store/info-docs/info-doc.entity';
import { ProfileImage } from '@modules/store/profile-images/profile-image.entity';
import { StudyDoc } from '@modules/store/study-docs/study-doc.entity';
import { TeamFile } from '@modules/store/team-files/team-file.entity';
import { BadgeUnlock } from '../../badges/entities/badge-unlock.entity';
import { Statistics } from '../../statistics/statistics.entity';
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
