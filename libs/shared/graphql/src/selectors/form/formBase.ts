import { formEditBaseInfo } from './formEdit/formEditBase';
import { OrderBy, Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const formBaseInfo = Selector('Form')({
  ...entityBase,
  schema: [{}, true],
  name: true,
  type: true,
  formEdits: [{ limit: 1, orderBy: [{ createdAt: OrderBy.DESC }] }, formEditBaseInfo],
});
export type FormBaseInfo = InputType<GraphQLTypes['Form'], typeof formBaseInfo>;
