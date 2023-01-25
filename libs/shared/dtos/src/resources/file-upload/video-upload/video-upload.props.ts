import { InputType } from '@nestjs/graphql';

// NOTE: Other VideoUpload props are implicitely retrieved from the uploaded file
@InputType()
export class VideoUploadProps {}
