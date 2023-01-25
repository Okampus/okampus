import { InputType, IntersectionType, OmitType } from '@nestjs/graphql';
import { ActorProps } from '../actor.props';
import { UserProps } from './user.props';

@InputType()
export class CreateUserDto extends IntersectionType(UserProps, OmitType(ActorProps, ['name'])) {}
