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
    @InjectRepository(Class) private readonly classRepository: BaseRepository<Class>,
    @InjectRepository(SchoolYear) private readonly schoolYearRepository: BaseRepository<SchoolYear>,
    @InjectRepository(ClassMembership)
    private readonly classMembershipsRepository: BaseRepository<ClassMembership>,
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
  ) {}

  public async findAllMembers(
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<ClassMembership>> {
    return await this.classMembershipsRepository.findWithPagination(
      paginationOptions,
      {},
      { populate: ['user', 'schoolClass'], orderBy: { user: { lastname: 'ASC' } } },
    );
  }

  public async findMembers(
    id: string,
    paginationOptions?: Required<PaginateDto>,
  ): Promise<PaginatedResult<ClassMembership>> {
    return await this.classMembershipsRepository.findWithPagination(
      paginationOptions,
      { schoolClass: { id } },
      { populate: ['user', 'schoolClass'], orderBy: { user: { lastname: 'ASC' } } },
    );
  }

  public async findActiveMembership(id: string, inClass: string | null = null): Promise<ClassMembership> {
    if (inClass === null) {
      return await this.classMembershipsRepository.findOneOrFail({
        user: { id },
        active: true,
      });
    }

    return await this.classMembershipsRepository.findOneOrFail({
      user: { id },
      schoolClass: { id: inClass },
      active: true,
    });
  }

  public async giveMembership(
    requester: User,
    classId: string,
    userId: string,
    createClassMembershipDto: CreateClassMembershipDto,
  ): Promise<ClassMembership> {
    // 1. Check that the given schoolClass, schoolYear and user exist, and fetch them.
    const schoolYear = await this.schoolYearRepository
      .findOneOrFail({ id: createClassMembershipDto.schoolYearId });

    const schoolClass = await this.classRepository.findOneOrFail(
      { id: classId },
      { populate: ['memberships'] },
    );

    const newMember = await this.userRepository.findOneOrFail({ id: userId });

    // 2. Check that the user has no active membership in the schoolClass.
    const activeMembership = await this.findActiveMembership(userId);

    if (activeMembership.schoolClass.id === classId)
      throw new BadRequestException('User already in schoolClass');

    // 3. Check if the requester can give membership to the user (giving membership to oneself is allowed for now)
    if (!schoolClass.canAdminister(requester) && requester.id !== userId)
      throw new ForbiddenException('Not allowed to give membership to user');

    // 4. Make previous active membership inactive; for now a user can only have one membership at a time
    activeMembership.active = false;

    // 5. Create new active membership
    const newMembership = new ClassMembership({
      user: newMember,
      schoolClass,
      schoolYear,
      role: createClassMembershipDto.classRole,
    });

    await this.classMembershipsRepository.flush();
    return newMembership;
  }

  public async removeMembership(
    requester: User,
    classId: string,
    userId: string,
  ): Promise<ClassMembership> {
    // 1. Check that the given schoolClass and user membership exist, and fetch them.
    const schoolClass = await this.classRepository.findOneOrFail(
      { id: classId },
      { populate: ['memberships'] },
    );

    const activeMembership = await this.classMembershipsRepository
      .findOneOrFail({ user: userId, schoolClass, active: true });

    // 2. Check if the requester can give membership to the user (giving membership to oneself is allowed for now)
    if (!schoolClass.canAdminister(requester) && requester.id !== userId)
      throw new ForbiddenException('Not allowed to give membership to user');

    // 3. Make previous membership inactive
    activeMembership.active = false;
    await this.classMembershipsRepository.flush();
    return activeMembership;
  }

  public async updateMembership(
    requester: User,
    classId: string,
    userId: string,
    updateClassMembershipDto: UpdateClassMembershipDto,
  ): Promise<ClassMembership> {
    // 1. Check that the given schoolClass and user membership exist, and fetch them.
    const schoolClass = await this.classRepository.findOneOrFail(
      { id: classId },
      { populate: ['memberships'] },
    );

    const activeMembership = await this.findActiveMembership(userId, classId);

    const { id, ...previousMembership } = activeMembership;
    // 2. Check that the given schoolYear exists
    const schoolYear = typeof updateClassMembershipDto.schoolYearId === 'string'
      ? await this.schoolYearRepository.findOneOrFail({ id: updateClassMembershipDto.schoolYearId })
      : null;

    // 3. Check if the requester can give membership to the user (giving membership to oneself is allowed for now)
    if (!schoolClass.canAdminister(requester) && requester.id !== userId)
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

    await this.classMembershipsRepository.flush();
    return newMembership;
  }
}
