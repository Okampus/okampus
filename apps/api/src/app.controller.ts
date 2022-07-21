import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from './shared/lib/decorators/public.decorator';

@ApiTags('Global')
@Controller()
export class AppController {
  private static readonly mainResponse = { status: 'ok', message: 'Welcome to our API!' };

  @Get()
  @Public()
  public find(): typeof AppController.mainResponse {
    return AppController.mainResponse;
  }
}
