import { TagProps } from '../tag/tag.props';
import { InputType } from '@nestjs/graphql';

@InputType()
export class TeamCategoryProps extends TagProps {}
