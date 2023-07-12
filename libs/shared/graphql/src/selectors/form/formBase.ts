import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const formBaseInfo = Selector('Form')({ ...entityBase, schema: [{}, true], name: true, type: true });
export type FormBaseInfo = InputType<GraphQLTypes['Form'], typeof formBaseInfo>;
