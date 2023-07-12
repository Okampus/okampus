import { $ } from '../../zeus';
import { typedGql } from '../../zeus/typedDocumentNode';
import { fileUploadBaseInfo } from '../../selectors/fileUpload/fileUploadBase';
import type { ValueTypes } from '../../zeus';

export const singleUploadMutation = typedGql('mutation')({
  singleUpload: [
    { file: $('file', 'Upload!') as ValueTypes['Upload'], bucket: $('bucket', 'String') as unknown as string },
    fileUploadBaseInfo,
  ],
});
