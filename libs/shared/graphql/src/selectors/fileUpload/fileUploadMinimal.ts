import { Selector } from '../../zeus';
import { entityBase } from '../entityBase';

import type { GraphQLTypes, InputType } from '../../zeus';

export const fileUploadMinimalInfo = Selector('FileUpload')({ ...entityBase, url: true });
export type FileUploadMinimalInfo = InputType<GraphQLTypes['FileUpload'], typeof fileUploadMinimalInfo>;
