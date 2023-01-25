import { InputType } from '@nestjs/graphql';
import { TagProps } from './tag.props';

@InputType()
export class CreateTagDto extends TagProps {}
