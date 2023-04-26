import { TagProps } from './tag.props';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateTagDto extends TagProps {}
