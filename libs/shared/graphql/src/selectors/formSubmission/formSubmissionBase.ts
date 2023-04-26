import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';
import { formEditBaseInfo } from '../form/formEdit/formEditBase';
import type { GraphQLTypes, InputType } from '../../zeus';

export const formSubmissionBaseInfo = Selector('FormSubmission')({
  ...entityBase,
  submission: [{}, true],
  formEdit: formEditBaseInfo,
});
export type FormSubmissionBaseInfo = InputType<GraphQLTypes['FormSubmission'], typeof formSubmissionBaseInfo>;
