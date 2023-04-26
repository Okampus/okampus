import { UserInfoProps } from './user.props';
import { ActorProps } from '../../actor/actor.props';
import { InputType, IntersectionType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto extends IntersectionType(UserInfoProps, OmitType(ActorProps, ['name'])) {}
