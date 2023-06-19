import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { formBaseInfo } from '../form/formBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const formSubmissionBaseInfo = Selector('FormSubmission')({
  ...entityBase,
  form: formBaseInfo,
  submission: [{}, true],
});
export type FormSubmissionBaseInfo = InputType<GraphQLTypes['FormSubmission'], typeof formSubmissionBaseInfo>;
