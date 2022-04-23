import type { AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Ability, AbilityBuilder, ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Badge } from '../../../badges/entities/badge.entity';
import { Blog } from '../../../blogs/blog.entity';
import type { Contact } from '../../../contacts/entities/contact.entity';
import { Content } from '../../../contents/entities/content.entity';
import { Favorite } from '../../../favorites/favorite.entity';
import { Attachment } from '../../../files/attachments/attachment.entity';
import { InfoDoc } from '../../../files/info-docs/info-doc.entity';
import { ProfileImage } from '../../../files/profile-images/profile-image.entity';
import { StudyDoc } from '../../../files/study-docs/study-doc.entity';
import { Report } from '../../../reports/report.entity';
import { DailyInfo } from '../../../restaurant/daily-info/daily-info.entity';
import { DailyMenu } from '../../../restaurant/daily-menus/daily-menu.entity';
import { Food } from '../../../restaurant/food/food.entity';
import { Subject } from '../../../subjects/subject.entity';
import { Tag } from '../../../tags/tag.entity';
import { Team } from '../../../teams/entities/team.entity';
import { Thread } from '../../../threads/thread.entity';
import { User } from '../../../users/user.entity';
import { WikiPage } from '../../../wiki/wiki-page.entity';
import { ContentKind } from '../../lib/types/enums/content-kind.enum';
import { TeamKind } from '../../lib/types/enums/team-kind.enum';
import { Action } from '../authorization/types/action.enum';
import { Role } from '../authorization/types/role.enum';

export type Subjects = InferSubjects<
  | typeof Attachment
  | typeof Badge
  | typeof Blog
  | typeof Contact
  | typeof Content
  | typeof DailyInfo
  | typeof DailyMenu
  | typeof Favorite
  | typeof Food
  | typeof InfoDoc
  | typeof ProfileImage
  | typeof Report
  | typeof StudyDoc
  | typeof Subject
  | typeof Tag
  | typeof Team
  | typeof Thread
  | typeof User
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
    const isAuthor = { 'author.userId': user.userId } as const;
    const isFileUploader = { 'file.user.userId': user.userId } as const;
    const isClub = { kind: TeamKind.Club } as const;

    if (user.roles.includes(Role.Admin)) {
      allow(Action.Manage, 'all');
    } else {
      allow(Action.Read, 'all');
      forbid(Action.Read, Report);
      // @ts-expect-error
      allow([Action.Read, Action.Update], Report, { 'user.userId': user.userId });

      allow(Action.Create, [Attachment, Content, Favorite, InfoDoc, StudyDoc, Tag, Thread]);
      allow(Action.Report, 'all');
      // @ts-expect-error
      forbid(Action.Report, Content, isAuthor)
        .because('Cannot report your own content');
      allow(Action.Interact, Content);

      // This is all managed by-hand inside the services.
      allow(Action.Update, Team);

      if (user.roles.includes(Role.Moderator)) {
        allow(Action.Read, 'all');
        allow(Action.Update, 'all');
        forbid(Action.Update, Badge);
        allow(Action.Manage, [Blog, Content, InfoDoc, ProfileImage, Report, StudyDoc, Subject, Tag, Thread, WikiPage]);
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

      if (user.roles.includes(Role.ClubManager))
        allow(Action.Manage, Team, isClub);
    }

    forbid(Action.Delete, Content, { kind: ContentKind.Post })
      .because('Cannot delete posts, only threads');
    forbid(Action.Update, User)
      .because('Not the user');
    allow(Action.Update, User, { userId: user.userId })
      .because('Not the user');
    /* eslint-enable @typescript-eslint/naming-convention */

    ForbiddenError.setDefaultMessage(error => `Cannot perform ${error.action.toLowerCase()} on a ${error.subjectType.toLowerCase()}`);

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  public canSeeHiddenContent(user: User): boolean {
    return user.roles.includes(Role.Moderator);
  }
}
