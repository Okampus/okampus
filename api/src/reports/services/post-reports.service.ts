import { InjectRepository } from '@mikro-orm/nestjs';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Post } from '../../posts/entities/post.entity';
import { BaseRepository } from '../../shared/lib/repositories/base.repository';
import { assertPermissions } from '../../shared/lib/utils/assertPermission';
import { Action } from '../../shared/modules/authorization';
import { CaslAbilityFactory } from '../../shared/modules/casl/casl-ability.factory';
import type { PaginationOptions } from '../../shared/modules/pagination/pagination-option.interface';
import type { PaginatedResult } from '../../shared/modules/pagination/pagination.interface';
import type { User } from '../../users/user.entity';
import type { CreateReportDto } from '../dto/create-report.dto';
import { PostReport } from '../entities/post-report.entity';
import { ReportSearchService } from './report-search.service';

@Injectable()
export class PostReportsService {
  constructor(
    @InjectRepository(PostReport) private readonly postReportRepository: BaseRepository<PostReport>,
    @InjectRepository(Post) private readonly postRepository: BaseRepository<Post>,
    private readonly reportSearchService: ReportSearchService,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  public async create(postId: number, user: User, createReportDto: CreateReportDto): Promise<PostReport> {
    const post = await this.postRepository.findOneOrFail({ postId });

    const ability = this.caslAbilityFactory.createForUser(user);
    assertPermissions(ability, Action.Report, post);

    const reports = await this.postReportRepository.count({ post, user });
    if (reports !== 0)
      throw new BadRequestException('User already reported this post');

    const report = new PostReport({ post, user, ...createReportDto });
    await this.postReportRepository.persistAndFlush(report);
    await this.reportSearchService.add(report);
    return report;
  }

  public async findAll(paginationOptions?: PaginationOptions): Promise<PaginatedResult<PostReport>> {
    return await this.postReportRepository.findWithPagination(
      paginationOptions,
      { kind: 'post' },
      { populate: ['post', 'user'] },
    );
  }

  public async findAllReportsForPost(
    postId: number,
    paginationOptions?: PaginationOptions,
  ): Promise<PaginatedResult<PostReport>> {
    return await this.postReportRepository.findWithPagination(
      paginationOptions,
      { post: { postId } },
      { populate: ['post', 'user'] },
    );
  }
}
