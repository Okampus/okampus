import { createReadStream, promises as fs, constants as fsConst } from 'node:fs';
import {
  Controller,
  Get,
  InternalServerErrorException,
  Param,
  Response,
  StreamableFile,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response as Res } from 'express';
import { FileUploadsService } from './file-uploads.service';

@ApiTags('FileUploads')
@Controller({ path: 'files/uploads' })
export class FileUploadsController {
  constructor(
    private readonly filesService: FileUploadsService,
  ) {}

  @Get(':id')
  public async findFile(
    @Param('id') id: string,
    @Response({ passthrough: true }) res: Res,
  ): Promise<StreamableFile> {
    const file = await this.filesService.findOne(id);

    res.set({
      /* eslint-disable @typescript-eslint/naming-convention */
      'Content-Type': file.mimeType,
      'Content-Disposition': `attachment; filename="${file.originalName}"`,
      /* eslint-enable @typescript-eslint/naming-convention */
    });

    return await fs.access(file.getPath(), fsConst.F_OK)
      .then(() => new StreamableFile(createReadStream(file.getPath())))
      .catch(() => { throw new InternalServerErrorException('File cannot be read'); });
  }
}
