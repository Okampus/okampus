import { InputType } from '@nestjs/graphql';

// NOTE: Other ImageUpload props are implicitely retrieved from the uploaded file
@InputType()
export class ImageUploadProps {}
