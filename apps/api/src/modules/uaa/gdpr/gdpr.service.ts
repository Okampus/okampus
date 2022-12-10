import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { Blog } from '@create/blogs/blog.entity';
import { Content } from '@create/contents/entities/content.entity';
import { Thread } from '@create/threads/thread.entity';
import { Favorite } from '@interact/favorites/favorite.entity';
import { Reaction } from '@interact/reactions/reaction.entity';
import { Report } from '@interact/reports/report.entity';
import { Vote } from '@interact/votes/vote.entity';
import { BaseRepository } from '@lib/orm/base.repository';
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
import type { User } from '@uaa/users/user.entity';
import { Attachment } from '@upload/attachments/attachment.entity';
import { InfoDoc } from '@upload/info-docs/info-doc.entity';
import { StudyDoc } from '@upload/study-docs/study-doc.entity';
import { TeamFile } from '@upload/team-files/team-file.entity';

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
    @InjectRepository(StudyDoc) private readonly studyDocRepository: BaseRepository<StudyDoc>,
    @InjectRepository(TeamFile) private readonly teamFileRepository: BaseRepository<TeamFile>,
    @InjectRepository(Reaction) private readonly reactionRepository: BaseRepository<Reaction>,
    @InjectRepository(Report) private readonly reportRepository: BaseRepository<Report>,
    @InjectRepository(Statistics) private readonly statisticsRepository: BaseRepository<Statistics>,
    @InjectRepository(EventRegistration) private readonly eventRegistrationRepository: BaseRepository<EventRegistration>,
    @InjectRepository(Event) private readonly eventRepository: BaseRepository<Event>,
    @InjectRepository(TeamForm) private readonly teamFormRepository: BaseRepository<TeamForm>,
    @InjectRepository(TeamMember) private readonly teamMemberRepository: BaseRepository<TeamMember>,
    @InjectRepository(TeamMembershipRequest) private readonly teamMembershipRequestRepository: BaseRepository<TeamMembershipRequest>,
    @InjectRepository(Thread) private readonly threadRepository: BaseRepository<Thread>,
    @InjectRepository(UserImage) private readonly userImageRepository: BaseRepository<UserImage>,
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
    const userImages          = await this.userImageRepository.find({ file: { user } });
    const studyDocs           = await this.studyDocRepository.find({ file: { user } });
    const teamFiles           = await this.teamFileRepository.find({ file: { user } });
    const reactions           = await this.reactionRepository.find({ user });
    const reports             = await this.reportRepository.find({ user });
    const statistics          = await this.statisticsRepository.findOne({ user });
    const eventRegistrations  = await this.eventRegistrationRepository.find({ user });
    const createdEvents       = await this.eventRepository.find({ createdBy: user });
    const supervisedEvents    = await this.eventRepository.find({ supervisor: { user } });
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
      userImages,
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
