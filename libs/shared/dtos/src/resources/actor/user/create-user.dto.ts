import { UserProps } from './user.props';
import { ActorProps } from '../actor.props';
import { InputType, IntersectionType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateUserDto extends IntersectionType(UserProps, OmitType(ActorProps, ['name'])) {}
