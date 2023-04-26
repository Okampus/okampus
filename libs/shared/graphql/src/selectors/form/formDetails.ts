import { formEditBaseInfo } from './formEdit/formEditBase';
import { formBaseInfo } from './formBase';
import { OrderBy, Selector } from '../../zeus';

import type { GraphQLTypes, InputType } from '../../zeus';

export const formDetailsInfo = Selector('Form')({
  ...formBaseInfo,
  formEdits: [{ orderBy: [{ createdAt: OrderBy.DESC }] }, formEditBaseInfo],
});
export type FormDetailsInfo = InputType<GraphQLTypes['Form'], typeof formDetailsInfo>;
