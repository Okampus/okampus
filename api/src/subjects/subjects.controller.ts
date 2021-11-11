import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import type { Subject } from './subject.entity';
import { SubjectsService } from './subjects.service';

@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  public async create(@Body() createSubjectDto: CreateSubjectDto): Promise<Subject> {
    return await this.subjectsService.create(createSubjectDto);
  }

  @Get()
  public async findAll(): Promise<Subject[]> {
    return await this.subjectsService.findAll();
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<Subject> {
    return await this.subjectsService.findOne(id);
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    return await this.subjectsService.update(id, updateSubjectDto);
  }

  @Delete(':id')
  public async remove(@Param('id') id: string): Promise<void> {
    return await this.subjectsService.remove(id);
  }
}
