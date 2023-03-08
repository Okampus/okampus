// @index(['./**/*.{ts,tsx}', './*/index.{ts,tsx}'], f => `export * from '${f.path.replace(/\/index$/, '')}'`)
export * from './embeds/address.embed';
export * from './embeds/oidc.embed';
export * from './embeds/user-customization.embed';
export * from './embeds/user-notification-settings.embed';
export * from './embeds/user-settings.embed';
export * from './embeds/user-stats.embed';
export * from './resources/actor/actor.interface';
export * from './resources/actor/actor.props';
export * from './resources/actor/bot/bot.interface';
export * from './resources/actor/bot/bot.props';
export * from './resources/actor/bot/create-bot.dto';
export * from './resources/actor/bot/update-bot.dto';
export * from './resources/actor/individual/individual.interface';
export * from './resources/actor/individual/individual.props';
export * from './resources/actor/shortcut/shortcut.interface';
export * from './resources/actor/shortcut/shortcut.props';
export * from './resources/actor/user-profile/user-profile.interface';
export * from './resources/actor/user-profile/user-profile.props';
export * from './resources/actor/user/create-user.dto';
export * from './resources/actor/user/update-user.dto';
export * from './resources/actor/user/user.interface';
export * from './resources/actor/user/user.props';
export * from './resources/base.interface';
export * from './resources/content-master/content-master.interface';
export * from './resources/content-master/content-master.props';
export * from './resources/content-master/event/create-event.dto';
export * from './resources/content-master/event/event.interface';
export * from './resources/content-master/event/event.props';
export * from './resources/content-master/event/update-event.dto';
export * from './resources/file-upload/document-upload/document-upload.interface';
export * from './resources/file-upload/document-upload/document-upload.props';
export * from './resources/file-upload/file-upload.interface';
export * from './resources/file-upload/file-upload.props';
export * from './resources/file-upload/image-upload/image-upload.interface';
export * from './resources/file-upload/image-upload/image-upload.props';
export * from './resources/file-upload/video-upload/video-upload.interface';
export * from './resources/file-upload/video-upload/video-upload.props';
export * from './resources/interaction/favorite/favorite.props';
export * from './resources/interaction/interaction.props';
export * from './resources/interaction/reaction/reaction.props';
export * from './resources/interaction/report/report.props';
export * from './resources/interaction/validation/validation.props';
export * from './resources/interaction/vote/vote.props';
export * from './resources/join/event-join/event-join.interface';
export * from './resources/join/event-join/event-join.props';
export * from './resources/join/join.interface';
export * from './resources/join/join.props';
export * from './resources/join/team-join/team-join.interface';
export * from './resources/join/team-join/team-join.props';
export * from './resources/label/subject/subject.props';
export * from './resources/label/tag/create-tag.dto';
export * from './resources/label/tag/tag.interface';
export * from './resources/label/tag/tag.props';
export * from './resources/label/tag/update-tag.dto';
export * from './resources/label/team-category/create-team-category.dto';
export * from './resources/label/team-category/team-category.interface';
export * from './resources/label/team-category/team-category.props';
export * from './resources/label/team-category/update-team-category.dto';
export * from './resources/manage-actor/actor-image/actor-image.interface';
export * from './resources/manage-actor/actor-image/actor-image.props';
export * from './resources/manage-actor/social/social.interface';
export * from './resources/manage-actor/social/social.props';
export * from './resources/manage-org/org-document/create-org-document.dto';
export * from './resources/manage-org/org-document/org-document.interface';
export * from './resources/manage-org/org-document/org-document.props';
export * from './resources/manage-org/org-metric/org-metric.props';
export * from './resources/manage-team/finance/create-finance.dto';
export * from './resources/manage-team/finance/finance.interface';
export * from './resources/manage-team/finance/finance.props';
export * from './resources/manage-team/finance/update-finance.dto';
export * from './resources/manage-team/project/create-project.dto';
export * from './resources/manage-team/project/project.interface';
export * from './resources/manage-team/project/project.props';
export * from './resources/manage-team/project/update-project.dto';
export * from './resources/manage-team/team-action/team-action.interface';
export * from './resources/manage-team/team-action/team-action.props';
export * from './resources/manage-tenant/event-approval-step/create-event-approval-step.dto';
export * from './resources/manage-tenant/event-approval-step/event-approval-step.interface';
export * from './resources/manage-tenant/event-approval-step/event-approval-step.props';
export * from './resources/manage-tenant/event-approval-step/update-event-approval-step.dto';
export * from './resources/manage-tenant/event-approval/create-event-approval.dto';
export * from './resources/manage-tenant/event-approval/event-approval.interface';
export * from './resources/manage-tenant/event-approval/event-approval.props';
export * from './resources/manage-tenant/event-approval/update-event-approval.dto';
export * from './resources/manage-user/teach-class/teach-class.props';
export * from './resources/membership/canteen-member/canteen-member.props';
export * from './resources/membership/class-group-member/class-group-member.props';
export * from './resources/membership/cohort-member/cohort-member.props';
export * from './resources/membership/membership.interface';
export * from './resources/membership/membership.props';
export * from './resources/membership/team-member/team-member.interface';
export * from './resources/membership/team-member/team-member.props';
export * from './resources/membership/tenant-member/tenant-member.props';
export * from './resources/org/canteen/canteen.props';
export * from './resources/org/class-group/class-group.props';
export * from './resources/org/cohort/cohort.props';
export * from './resources/org/org.interface';
export * from './resources/org/org.props';
export * from './resources/org/team/create-team.dto';
export * from './resources/org/team/team.interface';
export * from './resources/org/team/team.props';
export * from './resources/org/team/update-team.dto';
export * from './resources/org/tenant';
export * from './resources/org/tenant/tenant-core/tenant-core.interface';
export * from './resources/org/tenant/tenant-core/tenant-core.props';
export * from './resources/org/tenant/tenant/create-tenant.dto';
export * from './resources/org/tenant/tenant/tenant.interface';
export * from './resources/org/tenant/tenant/tenant.props';
export * from './resources/org/tenant/tenant/update-tenant.dto';
export * from './resources/paginated.interface';
export * from './resources/role/canteen-role/canteen-role.interface';
export * from './resources/role/canteen-role/canteen-role.props';
export * from './resources/role/role.interface';
export * from './resources/role/role.props';
export * from './resources/role/team-role/team-role.interface';
export * from './resources/role/team-role/team-role.props';
export * from './resources/session/session.props';
export * from './resources/taggable-entity.interface';
export * from './resources/tenant-scoped.interface';
export * from './resources/ugc/content-edit/content-edit.props';
export * from './resources/ugc/content/content.interface';
export * from './resources/ugc/content/content.props';
export * from './resources/ugc/document-edit/document-edit.interface';
export * from './resources/ugc/document-edit/document-edit.props';
export * from './resources/ugc/document/create-document.dto';
export * from './resources/ugc/document/document.interface';
export * from './resources/ugc/document/document.props';
export * from './resources/ugc/document/info-document.props';
export * from './resources/ugc/document/study-document.props';
export * from './resources/ugc/document/update-document.dto';
export * from './resources/ugc/form-edit/form-edit.interface';
export * from './resources/ugc/form-edit/form-edit.props';
export * from './resources/ugc/form-submission-edit/form-submission-edit.interface';
export * from './resources/ugc/form-submission-edit/form-submission-edit.props';
export * from './resources/ugc/form-submission/form-submission.interface';
export * from './resources/ugc/form-submission/form-submission.props';
export * from './resources/ugc/form/form.interface';
export * from './resources/ugc/form/form.props';
export * from './resources/ugc/ugc.interface';
export * from './resources/ugc/ugc.props';
export * from './validators/diff.validator';
export * from './validators/formkit-schema.validator';
export * from './validators/iso-8601-duration.validator';
// @endindex
