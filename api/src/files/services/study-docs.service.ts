import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PaginateModel } from 'mongoose';
import type { CustomPaginateResult } from '../../shared/pagination';
import { labelize } from '../../shared/pagination';
import type { User } from '../../users/user.schema';
import type { CreateStudyDocDto } from '../dto/create-study-doc.dto';
import type { UpdateStudyDocDto } from '../dto/update-study-doc.dto';
import { FileUpload } from '../schemas/file-upload.schema';
import { StudyDoc } from '../schemas/study-doc.schema';

@Injectable()
export class StudyDocsService {
  constructor(
    @InjectModel(StudyDoc.name) private readonly studyDocModel: PaginateModel<StudyDoc>,
    @InjectModel(FileUpload.name) private readonly fileUploadModel: Model<FileUpload>,
  ) {}

  public async getUploadByName(name: string): Promise<StudyDoc | null> {
    return await this.studyDocModel.findOne({ courseDocModel: { $regex: new RegExp(`^${name}$`, 'i') } });
  }

  public async validateUploadByName(uploadName: string): Promise<StudyDoc> {
    const upload = await this.getUploadByName(uploadName);
    if (!upload)
      throw new NotFoundException('Upload not found');

    return upload;
  }

  public async getUploadById(id: string): Promise<StudyDoc | null> {
    return await this.studyDocModel.findById(id);
  }

  public async validateUploadById(id: string): Promise<StudyDoc> {
    const upload = await this.getUploadById(id);
    if (!upload)
      throw new NotFoundException('Upload not found');

    return upload;
  }

  public async create(body: CreateStudyDocDto, file: FileUpload): Promise<StudyDoc> {
    const upload = await this.studyDocModel.create({ ...body, file });
    return upload;
  }

  public async findAll(
    paginationOptions?: { page: number; itemsPerPage: number },
  ): Promise<CustomPaginateResult<StudyDoc> | StudyDoc[]> {
    if (paginationOptions) {
      return labelize(await this.studyDocModel.paginate({}, {
        page: paginationOptions.page,
        limit: paginationOptions.itemsPerPage,
        populate: {
          path: 'file',
          populate: {
            path: 'author',
            select: 'username',
          },
        },
      }));
    }
    return await this.studyDocModel.find();
  }

  public async findOne(id: number): Promise<StudyDoc> {
    const coursedoc = await this.studyDocModel.findById(id);
    if (!coursedoc)
      throw new NotFoundException('Doc not found');
    return coursedoc;
  }

  public async update(user: User, id: number, updateCourseDto: UpdateStudyDocDto): Promise<StudyDoc> {
    const courseDoc = await this.studyDocModel.findById(id);
    if (!courseDoc)
      throw new NotFoundException('Post not found');
    if (!courseDoc.file.author._id.equals(user._id))
      throw new ForbiddenException('Not the author');

    Object.assign(courseDoc, updateCourseDto);
    return await courseDoc.save();
  }

  public async remove(user: User, id: number): Promise<void> {
    const courseDoc = await this.studyDocModel.findById(id);
    if (!courseDoc)
      throw new NotFoundException('Doc not found');
    if (!courseDoc.file.author._id.equals(user._id))
      throw new ForbiddenException('Not the author');

    await courseDoc.remove();
  }
}
