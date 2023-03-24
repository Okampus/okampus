/* eslint-disable import/no-cycle */
import { ProjectModel, RoleModel } from '../../index';

import { Field, Int, ObjectType } from '@nestjs/graphql';
import type { IProject, IProjectRole } from '@okampus/shared/dtos';

@ObjectType()
export class ProjectRoleModel extends RoleModel implements IProjectRole {
  @Field(() => ProjectModel)
  project?: IProject;

  @Field(() => String)
  description!: string;

  @Field(() => Boolean)
  autoAccept!: boolean;

  @Field(() => Int, { nullable: true })
  rewardMinimum: number | null = null;

  @Field(() => Int, { nullable: true })
  rewardMaximum: number | null = null;

  constructor(role: IProjectRole) {
    super(role);
    this.assign(role);
  }
}
