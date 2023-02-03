import { InputType } from '@nestjs/graphql';
import { TagProps } from '../tag/tag.props';

@InputType()
export class TeamCategoryProps extends TagProps {}
