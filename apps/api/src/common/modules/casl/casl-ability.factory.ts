import type { AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Ability, AbilityBuilder, ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Food } from '@canteens/foods/food.entity';
import { Menu } from '@canteens/menus/menu.entity';
import type { Label } from '@catalog/labels/label.entity';
import { Subject } from '@catalog/subjects/subject.entity';
import { Tag } from '@catalog/tags/tag.entity';
import type { Class } from '@classes/class.entity';
import type { SchoolYear } from '@classes/school-year/school-year.entity';
import { Action } from '@common/modules/authorization/types/action.enum';
import { Role } from '@common/modules/authorization/types/role.enum';
import { Blog } from '@create/blogs/blog.entity';
import { Content } from '@create/contents/entities/content.entity';
import { Thread } from '@create/threads/thread.entity';
import { Wiki } from '@create/wikis/wiki.entity';
import { Favorite } from '@interact/favorites/favorite.entity';
import { Report } from '@interact/reports/report.entity';
import { AnnouncementState } from '@lib/types/enums/announcement-state.enum';
import { ContentKind } from '@lib/types/enums/content-kind.enum';
import { TeamKind } from '@lib/types/enums/team-kind.enum';
import type { App } from '@org/apps/app.entity';
import { EventApproval } from '@plan/approvals/approval.entity';
import { Event } from '@plan/events/event.entity';
import { Announcement } from '@teams/announcements/announcement.entity';
import { TeamFinance } from '@teams/finances/team-finance.entity';
import { TeamForm } from '@teams/forms/team-form.entity';
import type { TeamHistory } from '@teams/histories/team-history.entity';
import type { Interest } from '@teams/interests/interest.entity';
import { Metric } from '@teams/metrics/metric.entity';
import type { Social } from '@teams/socials/social.entity';
import type { TeamImage } from '@teams/team-images/team-image.entity';
import { Team } from '@teams/team.entity';
import { ApprovalStep } from '@tenants/approval-steps/approval-step.entity';
import type { TenantImage } from '@tenants/tenant-images/tenant-image.entity';
import { Tenant } from '@tenants/tenant.entity';
import { Badge } from '@uaa/badges/entities/badge.entity';
import { Settings } from '@uaa/settings/settings.entity';
import type { UserImage } from '@uaa/user-images/user-image.entity';
import { User } from '@uaa/users/user.entity';
import { Attachment } from '@upload/attachments/attachment.entity';
import { InfoDoc } from '@upload/info-docs/info-doc.entity';
import { StudyDoc } from '@upload/study-docs/study-doc.entity';
import { TeamFile } from '@upload/team-files/team-file.entity';
import type { TeamGallery } from '@upload/team-galleries/team-gallery.entity';
import type { TeamReceipt } from '@upload/team-receipts/team-receipt.entity';

export type Subjects =
  | InferSubjects<
      | typeof Announcement
      | typeof App
      | typeof ApprovalStep
      | typeof Attachment
      | typeof Badge
      | typeof Blog
      | typeof Class
      | typeof Content
      | typeof Event
      | typeof EventApproval
      | typeof Favorite
      | typeof Food
      | typeof InfoDoc
      | typeof Interest
      | typeof Label
      | typeof Menu
      | typeof Metric
      | typeof Report
      | typeof SchoolYear
      | typeof Settings
      | typeof Social
      | typeof StudyDoc
      | typeof Subject
      | typeof Tag
      | typeof Team
      | typeof TeamFile
      | typeof TeamFinance
      | typeof TeamForm
      | typeof TeamGallery
      | typeof TeamHistory
      | typeof TeamImage
      | typeof TeamReceipt
      | typeof Tenant
      | typeof TenantImage
      | typeof Thread
      | typeof User
      | typeof UserImage
      | typeof Wiki
    >
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
    const {
      can: allow,
      cannot: forbid,
      build,
    } = new AbilityBuilder<AppAbility>(Ability as AbilityClass<AppAbility>);

    // TODO: rules for modifying UserImage, TeamImage, App
    // TODO: rules for modifying specific fields of User, Team, etc.

    /* eslint-disable @typescript-eslint/naming-convention */
    const isAuthor = { 'author.id': user.id } as const;
    const isFileUploader = { 'file.user.id': user.id } as const;
    const isClub = { kind: TeamKind.Club } as const;
    const isMe = { 'user.userId': user.id } as const;
    const isBotOwner = { 'owner.id': user.id, bot: true } as const;

    if (user.roles.includes(Role.TenantAdmin)) {
      allow(Action.Manage, 'all');
    } else {
      allow(Action.Read, 'all');
      forbid(Action.Read, [Tenant, Report, Announcement, Metric]);
      forbid(Action.Manage, [ApprovalStep, EventApproval]);

      // @ts-expect-error
      allow([Action.Read, Action.Update], Report, isMe);

      allow(Action.Read, Announcement, {
        state: AnnouncementState.Committed,
        displayFrom: { $lte: new Date() },
      });

      allow(Action.Create, [
        Attachment,
        Content,
        Favorite,
        InfoDoc,
        StudyDoc,
        Tag,
        Thread,
      ]);
      allow(Action.Report, 'all');
      // @ts-expect-error
      forbid(Action.Report, Content, isAuthor).because(
        'Cannot report your own content',
      );
      allow(Action.Interact, Content);

      // This is all managed by-hand inside the services.
      allow(Action.Manage, [Team, Event, TeamFile, TeamFinance, TeamForm]);

      forbid(Action.Update, User).because('Not the user');
      allow(Action.Update, User, { id: user.id }).because('Not the user');
      allow(Action.Update, User, isBotOwner);

      if (user.roles.includes(Role.Moderator)) {
        allow(Action.Read, 'all');
        allow(Action.Update, 'all');
        forbid(Action.Update, [Badge, EventApproval]);
        forbid(Action.Manage, [Tenant, ApprovalStep]);
        allow(Action.Manage, [
          Announcement,
          Blog,
          Content,
          InfoDoc,
          Report,
          StudyDoc,
          Subject,
          Tag,
          Thread,
          Wiki,
        ]);
      } else {
        forbid(Action.Manage, [Blog, Thread], {
          // @ts-expect-error
          'post.isVisible': false,
        }).because('Content has been removed');
        forbid(Action.Manage, Wiki, { hidden: true }).because(
          'Content has been removed',
        );
        forbid(Action.Manage, Content, { isVisible: false }).because(
          'Content has been removed',
        );
        forbid(Action.Manage, [Attachment, Favorite, Report], {
          // @ts-expect-error
          'content.isVisible': false,
        }).because('Content has been removed');

        allow(
          Action.Update,
          Thread,
          ['opValidated', 'tags', 'title', 'type'],
          // @ts-expect-error
          isAuthor,
        ).because('Not the author');

        // @ts-expect-error
        allow(Action.Update, Content, ['body', 'hidden'], isAuthor).because(
          'Not the author',
        );

        allow(
          Action.Update,
          StudyDoc,
          ['description', 'docSeries', 'name', 'subject', 'tags', 'year'],
          // @ts-expect-error
          isFileUploader,
        ).because('Not the author');

        allow(
          Action.Update,
          InfoDoc,
          ['description', 'docSeries', 'name', 'tags', 'year'],
          // @ts-expect-error
          isFileUploader,
        ).because('Not the author');

        // @ts-expect-error
        allow(Action.Delete, Content, isAuthor).because('Not the author');
        // @ts-expect-error
        allow(Action.Delete, StudyDoc, isFileUploader).because(
          'Not the author',
        );
        // @ts-expect-error
        allow(Action.Delete, InfoDoc, isFileUploader).because('Not the author');

        forbid([Action.Update, Action.Delete, Action.Interact], Thread, {
          locked: true,
        }).because('Thread is locked');

        forbid(
          [Action.Create, Action.Update, Action.Delete, Action.Interact],
          Content,
          // @ts-expect-error
          { 'contentMaster.locked': true },
        ).because('Thread is locked');
      }

      if (user.roles.includes(Role.CafeteriaManager))
        allow(Action.Manage, [Menu, Food]);

      if (user.roles.includes(Role.ClubManager)) {
        allow(Action.Manage, Team, isClub);
        // @ts-expect-error
        allow(Action.Manage, [Event, TeamFile], { 'team.kind': TeamKind.Club });
        allow(Action.Manage, [Metric, Tenant, ApprovalStep, EventApproval]);
      }
    }

    forbid(Action.Delete, Content, { kind: ContentKind.Post }).because(
      'Cannot delete posts, only threads',
    );

    forbid(Action.Manage, Settings);
    // @ts-expect-error
    allow([Action.Read, Action.Update], Settings, isMe);
    /* eslint-enable @typescript-eslint/naming-convention */

    ForbiddenError.setDefaultMessage(
      error =>
        `Cannot perform ${error.action.toLowerCase()} on a ${error.subjectType.toLowerCase()}`,
    );

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  public isModOrAdmin(user: User): boolean {
    return (
      user.roles.includes(Role.Moderator) || user.roles.includes(Role.TenantAdmin)
    );
  }
}
