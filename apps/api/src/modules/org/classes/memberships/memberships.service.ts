import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { BaseRepository } from '@meta/shared/lib/orm/base.repository';
import type { PaginatedResult, PaginateDto } from '@meta/shared/modules/pagination';
import type { CreateClassMembershipDto } from '@modules/org/classes/memberships/dto/create-class-membership.dto';
import { User } from '@modules/uua/users/user.entity';
import { Class } from '../class.entity';
import { SchoolYear } from '../school-year/school-year.entity';
import { ClassMembership } from './class-membership.entity';
import type { UpdateClassMembershipDto } from './dto/update-class-membership.dto';

@Injectable()
export class ClassMembershipsService {
  constructor(
    @InjectRepository(Class) private readonly schoolGroupRepository: BaseRepository<Class>,
    @InjectRepository(SchoolYear) private readonly schoolYearRepository: BaseRepository<SchoolYear>,
    @InjectRepository(ClassMembership)
    private readonly schoolGroupMembershipsRepository: BaseRepository<ClassMembership>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async findAllMembers(
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<ClassMembership>> {
    return await this.schoolGroupMembershipsRepository.findWithPagination(
      paginationOptions,
      {},
      { populate: ['user', 'schoolGroup'], orderBy: { user: { lastname: 'ASC' } } },
    );
  }

  public async findMembers(
    id: string,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<ClassMembership>> {
    return await this.schoolGroupMembershipsRepository.findWithPagination(
      paginationOptions,
      { schoolGroup: { id } },
      { populate: ['user', 'schoolGroup'], orderBy: { user: { lastname: 'ASC' } } },
    );
  }

  public async findActiveMembership(id: string, inClass: string | null = null): Promise<ClassMembership> {
    if (inClass === null) {
      return await this.schoolGroupMembershipsRepository.findOneOrFail({
        user: { id },
        active: true,
      });
    }

    return await this.schoolGroupMembershipsRepository.findOneOrFail({
      user: { id },
      schoolGroup: { id: inClass },
      active: true,
    });
  }

  public async giveMembership(
    requester: User,
    schoolGroupId: string,
    userId: string,
    createClassMembershipDto: CreateClassMembershipDto,
  ): Promise<ClassMembership> {
    // 1. Check that the given schoolGroup, schoolYear and user exist, and fetch them.
    const schoolYear = await this.schoolYearRepository
      .findOneOrFail({ id: createClassMembershipDto.schoolYearId });

    const schoolGroup = await this.schoolGroupRepository.findOneOrFail(
      { id: schoolGroupId },
      { populate: ['memberships'] },
    );

    const newMember = await this.userRepository.findOneOrFail({ id: userId });

    // 2. Check that the user has no active membership in the schoolGroup.
    const activeMembership = await this.findActiveMembership(userId);

    if (activeMembership.schoolGroup.id === schoolGroupId)
      throw new BadRequestException('User already in schoolGroup');

    // 3. Check if the requester can give membership to the user (giving membership to oneself is allowed for now)
    if (!schoolGroup.canAdminister(requester) && requester.id !== userId)
      throw new ForbiddenException('Not allowed to give membership to user');

    // 4. Make previous active membership inactive; for now a user can only have one membership at a time
    activeMembership.active = false;

    // 5. Create new active membership
    const newMembership = new ClassMembership({
      user: newMember,
      schoolGroup,
      schoolYear,
      role: createClassMembershipDto.schoolGroupRole,
    });

    await this.schoolGroupMembershipsRepository.flush();
    return newMembership;
  }

  public async removeMembership(
    requester: User,
    schoolGroupId: string,
    userId: string,
  ): Promise<ClassMembership> {
    // 1. Check that the given schoolGroup and user membership exist, and fetch them.
    const schoolGroup = await this.schoolGroupRepository.findOneOrFail(
      { id: schoolGroupId },
      { populate: ['memberships'] },
    );

    const activeMembership = await this.schoolGroupMembershipsRepository
      .findOneOrFail({ user: userId, schoolGroup, active: true });

    // 2. Check if the requester can give membership to the user (giving membership to oneself is allowed for now)
    if (!schoolGroup.canAdminister(requester) && requester.id !== userId)
      throw new ForbiddenException('Not allowed to give membership to user');

    // 3. Make previous membership inactive
    activeMembership.active = false;
    await this.schoolGroupMembershipsRepository.flush();
    return activeMembership;
  }

  public async updateMembership(
    requester: User,
    schoolGroupId: string,
    userId: string,
    updateClassMembershipDto: UpdateClassMembershipDto,
  ): Promise<ClassMembership> {
    // 1. Check that the given schoolGroup and user membership exist, and fetch them.
    const schoolGroup = await this.schoolGroupRepository.findOneOrFail(
      { id: schoolGroupId },
      { populate: ['memberships'] },
    );

    const activeMembership = await this.findActiveMembership(userId, schoolGroupId);

    const { id, ...previousMembership } = activeMembership;
    // 2. Check that the given schoolYear exists
    const schoolYear = typeof updateClassMembershipDto.schoolYearId === 'string'
      ? await this.schoolYearRepository.findOneOrFail({ id: updateClassMembershipDto.schoolYearId })
      : null;

    // 3. Check if the requester can give membership to the user (giving membership to oneself is allowed for now)
    if (!schoolGroup.canAdminister(requester) && requester.id !== userId)
      throw new ForbiddenException('Not allowed to give membership to user');

    // 4. Create new membership
    const newMembership = new ClassMembership({
      ...previousMembership,
      ...updateClassMembershipDto,
      // FIXME(@iv-stpn): schoolYear is mandatory in ClassMembership, thus should always be set.
      ...(schoolYear ? { schoolYear } : {}),
    });

    // 4. Make previous membership inactive
    activeMembership.active = false;

    await this.schoolGroupMembershipsRepository.flush();
    return newMembership;
  }
}
