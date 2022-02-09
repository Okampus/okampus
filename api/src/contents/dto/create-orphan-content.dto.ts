import { IsTiptapJSONContent } from '../../shared/lib/decorators/is-tiptap-json-content.decorator';
import { TiptapContentLength } from '../../shared/lib/decorators/tiptap-content-length.decorator';
import { ContentMasterTypeDto } from './content-master-type.dto';

export class CreateOrphanContentDto extends ContentMasterTypeDto {
  @TiptapContentLength(25, 2000)
  @IsTiptapJSONContent()
  body: string;
}
