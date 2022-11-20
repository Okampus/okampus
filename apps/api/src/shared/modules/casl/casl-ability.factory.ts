import type { AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Ability, AbilityBuilder, ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Announcement } from '../../../announcements/announcement.entity';
import { DailyInfo } from '../../../cafeteria/daily-info/daily-info.entity';
import { DailyMenu } from '../../../cafeteria/daily-menus/daily-menu.entity';
import { Food } from '../../../cafeteria/food/food.entity';
import { Blog } from '../../../create/comm/blogs/blog.entity';
import { Thread } from '../../../create/comm/threads/thread.entity';
import { Content } from '../../../create/contents/entities/content.entity';
import { Favorite } from '../../../create/interact/favorites/favorite.entity';
import { Report } from '../../../create/interact/reports/report.entity';
import { Attachment } from '../../../files/attachments/attachment.entity';
import { InfoDoc } from '../../../files/info-docs/info-doc.entity';
import { ProfileImage } from '../../../files/profile-images/profile-image.entity';
import { StudyDoc } from '../../../files/study-docs/study-doc.entity';
import { TeamFile } from '../../../files/team-files/team-file.entity';
import type { TeamGallery } from '../../../files/team-galleries/team-gallery.entity';
import type { TeamReceipt } from '../../../files/team-receipts/team-receipt.entity';
import { Metric } from '../../../metrics/metric.entity';
import { Subject } from '../../../org/data/subjects/subject.entity';
import { Tag } from '../../../org/data/tags/tag.entity';
import type { SchoolGroup } from '../../../org/school-group/school-group.entity';
import type { SchoolYear } from '../../../org/school-group/school-year/school-year.entity';
import { TeamEventValidation } from '../../../org/teams/event-validations/team-event-validation.entity';
import { TeamEvent } from '../../../org/teams/events/team-event.entity';
import { TeamFinance } from '../../../org/teams/finances/team-finance.entity';
import { TeamForm } from '../../../org/teams/forms/team-form.entity';
import type { TeamHistory } from '../../../org/teams/histories/team-history.entity';
import type { Interest } from '../../../org/teams/interests/interest.entity';
import type { TeamLabel } from '../../../org/teams/labels/team-label.entity';
import { Team } from '../../../org/teams/teams/team.entity';
import { Tenant } from '../../../org/tenants/tenants/tenant.entity';
import { ValidationStep } from '../../../org/tenants/validation-steps/validation-step.entity';
import type { Social } from '../../../socials/social.entity';
import { Badge } from '../../../uua/badges/entities/badge.entity';
import { Settings } from '../../../uua/settings/settings.entity';
import { User } from '../../../uua/users/user.entity';
import { WikiPage } from '../../../create/comm/wikis/wiki-page.entity';
import { AnnouncementState } from '../../lib/types/enums/announcement-state.enum';
import { ContentKind } from '../../lib/types/enums/content-kind.enum';
import { TeamKind } from '../../lib/types/enums/team-kind.enum';
import { Action } from '../authorization/types/action.enum';
import { Role } from '../authorization/types/role.enum';

export type Subjects = InferSubjects<
  | typeof Announcement
  | typeof Attachment
  | typeof Badge
  | typeof Blog
  | typeof Content
  | typeof DailyInfo
  | typeof DailyMenu
  | typeof Favorite
  | typeof Food
  | typeof InfoDoc
  | typeof Interest
  | typeof Metric
  | typeof ProfileImage
  | typeof Report
  | typeof SchoolGroup
  | typeof SchoolYear
  | typeof Settings
  | typeof Social
  | typeof StudyDoc
  | typeof Subject
  | typeof Tag
  | typeof Team
  | typeof TeamEvent
  | typeof TeamEventValidation
  | typeof TeamFile
  | typeof TeamFinance
  | typeof TeamForm
  | typeof TeamGallery
  | typeof TeamHistory
  | typeof TeamLabel
  | typeof TeamReceipt
  | typeof Tenant
  | typeof Thread
  | typeof User
  | typeof ValidationStep
  | typeof WikiPage>
  | 'all';

export type AppAbility = Ability<[action: Action, subjects: Subjects]>;

// TODO: all this class needs a MAJOR refactor
@Injectable()
export class CaslAbilityFactory {
  public createForUser(user: User): AppAbility {
    /**
     * We have to make TypeScript ignore a lot of things here because CASL requires dot notation
     * for nested properties in conditions, but its typings don't allow it :(
     * In the future, it would be great to generate a "dot-property" type that flattens an entity,
     * but for now, we'll just ignore it.
     */
    /* eslint-disable @typescript-eslint/ban-ts-comment */

    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { can: allow, cannot: forbid, build } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

    /* eslint-disable @typescript-eslint/naming-convention */
    const isAuthor = { 'author.id': user.id } as const;
    const isFileUploader = { 'file.user.id': user.id } as const;
    const isClub = { kind: TeamKind.Club } as const;
    const isMe = { 'user.userId': user.id } as const;

    if (user.roles.includes(Role.Admin)) {
      allow(Action.Manage, 'all');
    } else {
      allow(Action.Read, 'all');
      forbid(Action.Read, [Tenant, Report, Announcement, Metric]);
      forbid(Action.Manage, [ValidationStep, TeamEventValidation]);

      // @ts-expect-error
      allow([Action.Read, Action.Update], Report, isMe);

      allow(Action.Read, Announcement, {
        state: AnnouncementState.Committed,
        displayFrom: { $lte: new Date() },
      });

      allow(Action.Create, [Attachment, Content, Favorite, InfoDoc, StudyDoc, Tag, Thread]);
      allow(Action.Report, 'all');
      // @ts-expect-error
      forbid(Action.Report, Content, isAuthor)
        .because('Cannot report your own content');
      allow(Action.Interact, Content);

      // This is all managed by-hand inside the services.
      allow(Action.Manage, [Team, TeamEvent, TeamFile, TeamFinance, TeamForm]);

      forbid(Action.Update, User)
        .because('Not the user');
      allow(Action.Update, User, { id: user.id })
        .because('Not the user');

      if (user.roles.includes(Role.Moderator)) {
        allow(Action.Read, 'all');
        allow(Action.Update, 'all');
        forbid(Action.Update, [Badge, TeamEventValidation]);
        forbid(Action.Manage, [Tenant, ValidationStep]);
        allow(
          Action.Manage,
          [Announcement, Blog, Content, InfoDoc, ProfileImage, Report, StudyDoc, Subject, Tag, Thread, WikiPage],
        );
      } else {
        // @ts-expect-error
        forbid(Action.Manage, [Blog, Thread], { 'post.isVisible': false })
          .because('Content has been removed');
        forbid(Action.Manage, WikiPage, { hidden: true })
          .because('Content has been removed');
        forbid(Action.Manage, Content, { isVisible: false })
          .because('Content has been removed');
        // @ts-expect-error
        forbid(Action.Manage, [Attachment, Favorite, Report], { 'content.isVisible': false })
          .because('Content has been removed');

        // @ts-expect-error
        allow(Action.Update, Thread, ['opValidated', 'tags', 'title', 'type'], isAuthor)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Update, Content, ['body', 'hidden'], isAuthor)
          .because('Not the author');

        // @ts-expect-error
        allow(Action.Update, StudyDoc, ['description', 'docSeries', 'name', 'subject', 'tags', 'year'], isFileUploader)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Update, InfoDoc, ['description', 'docSeries', 'name', 'tags', 'year'], isFileUploader)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Manage, ProfileImage, isFileUploader)
          .because('Not the user');

        // @ts-expect-error
        allow(Action.Delete, Content, isAuthor)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Delete, StudyDoc, isFileUploader)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Delete, InfoDoc, isFileUploader)
          .because('Not the author');

        forbid([Action.Update, Action.Delete, Action.Interact], Thread, { locked: true })
          .because('Thread is locked');
        // @ts-expect-error
        forbid([Action.Create, Action.Update, Action.Delete, Action.Interact], Content, { 'contentMaster.locked': true })
          .because('Thread is locked');
      }

      if (user.roles.includes(Role.RestaurantManager))
        allow(Action.Manage, [DailyInfo, DailyMenu, Food]);

      if (user.roles.includes(Role.ClubManager)) {
        allow(Action.Manage, Team, isClub);
        // @ts-expect-error
        allow(Action.Manage, [TeamEvent, TeamFile], { 'team.kind': TeamKind.Club });
        allow(Action.Manage, [Metric, Tenant, ValidationStep, TeamEventValidation]);
      }
    }

    forbid(Action.Delete, Content, { kind: ContentKind.Post })
      .because('Cannot delete posts, only threads');

    forbid(Action.Manage, Settings);
    // @ts-expect-error
    allow([Action.Read, Action.Update], Settings, isMe);
    /* eslint-enable @typescript-eslint/naming-convention */

    ForbiddenError.setDefaultMessage(error => `Cannot perform ${error.action.toLowerCase()} on a ${error.subjectType.toLowerCase()}`);

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  public isModOrAdmin(user: User): boolean {
    return user.roles.includes(Role.Moderator) || user.roles.includes(Role.Admin);
  }
}
