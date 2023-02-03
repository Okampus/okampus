import { InputType } from '@nestjs/graphql';

// NOTE: Other DocumentUpload props are implicitely retrieved from the uploaded file
@InputType()
export class DocumentUploadProps {}
