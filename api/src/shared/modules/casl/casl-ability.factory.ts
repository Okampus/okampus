import type { AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { Ability, AbilityBuilder, ForbiddenError } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Article } from '../../../articles/entities/article.entity';
import { Badge } from '../../../badges/badge.entity';
import { Club } from '../../../clubs/entities/club.entity';
import { Comment } from '../../../comments/entities/comment.entity';
import { Attachment } from '../../../files/attachments/attachment.entity';
import { InfoDoc } from '../../../files/info-docs/info-doc.entity';
import { ProfileImage } from '../../../files/profile-images/profile-image.entity';
import { StudyDoc } from '../../../files/study-docs/study-doc.entity';
import { Post } from '../../../posts/entities/post.entity';
import { Reply } from '../../../replies/entities/reply.entity';
import { ArticleReport } from '../../../reports/entities/article-report.entity';
import { CommentReport } from '../../../reports/entities/comment-report.entity';
import { PostReport } from '../../../reports/entities/post-report.entity';
import { ReplyReport } from '../../../reports/entities/reply-report.entity';
import type { Social } from '../../../socials/entities/social.entity';
import { Subject } from '../../../subjects/subject.entity';
import { Tag } from '../../../tags/tag.entity';
import { User } from '../../../users/user.entity';
import { Action } from '../authorization/types/action.enum';
import { Role } from '../authorization/types/role.enum';

export type Subjects = InferSubjects<
  | typeof Article
  | typeof ArticleReport
  | typeof Attachment
  | typeof Badge
  | typeof Club
  | typeof Comment
  | typeof CommentReport
  | typeof InfoDoc
  | typeof Post
  | typeof PostReport
  | typeof ProfileImage
  | typeof Reply
  | typeof ReplyReport
  | typeof Social
  | typeof StudyDoc
  | typeof Subject
  | typeof Tag
  | typeof User>
  | 'all';

const reports = [ArticleReport, CommentReport, PostReport, ReplyReport];

export type AppAbility = Ability<[action: Action, subjects: Subjects]>;

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

    const isAuthor = { 'author.userId': user.userId };

    if (user.roles.includes(Role.Admin)) {
      allow(Action.Manage, 'all');
    } else {
      allow(Action.Read, 'all');
      forbid(Action.Read, reports);
      allow(Action.Create, [Attachment, Comment, InfoDoc, Post, Reply, StudyDoc, Tag]);
      allow(Action.Report, 'all');
      // @ts-expect-error
      forbid(Action.Report, [Comment, Post, Reply], isAuthor)
        .because('Cannot report your own content');
      allow(Action.Interact, [Comment, Post, Reply]);

      // This is all managed by-hand inside the services.
      allow(Action.Update, Club);

      if (user.roles.includes(Role.Moderator)) {
        allow(Action.Update, 'all');
        forbid(Action.Update, Badge);
        allow(Action.Manage, [Article, InfoDoc, ProfileImage, ...reports, StudyDoc, Subject, Tag]);
      } else {
        // @ts-expect-error
        allow(Action.Update, Post, ['body', 'opened', 'solved', 'tags', 'title', 'type'], isAuthor)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Update, Comment, ['body'], isAuthor)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Update, Reply, ['body'], isAuthor)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Update, StudyDoc, ['description', 'docSeries', 'name', 'subject', 'tags', 'year'], { 'file.user.userId': user.userId })
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Update, InfoDoc, ['description', 'docSeries', 'name', 'tags', 'year'], { 'file.user.userId': user.userId })
          .because('Not the author');

        // @ts-expect-error
        allow(Action.Manage, ProfileImage, { 'file.user.userId': user.userId })
          .because('Not the user');

        // @ts-expect-error
        allow(Action.Delete, [Post, Comment, Reply], isAuthor)
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Delete, StudyDoc, { 'file.user.userId': user.userId })
          .because('Not the author');
        // @ts-expect-error
        allow(Action.Delete, InfoDoc, { 'file.user.userId': user.userId })
          .because('Not the author');

        forbid([Action.Update, Action.Delete, Action.Interact], Post, { locked: true })
          .because('Post is locked');
        // @ts-expect-error
        forbid([Action.Create, Action.Update, Action.Delete, Action.Interact], [Comment, Reply], { 'post.locked': true })
          .because('Post is locked');
      }
    }

    forbid(Action.Update, User).because('Not the user');
    allow(Action.Update, User, { userId: user.userId })
      .because('Not the user');

    ForbiddenError.setDefaultMessage(error => `Cannot perform ${error.action.toLowerCase()} on a ${error.subjectType.toLowerCase()}`);

    return build({
      detectSubjectType: item => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
