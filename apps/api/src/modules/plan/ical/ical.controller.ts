import {
  CacheInterceptor,
  CacheTTL,
  Controller,
  Get,
  Header,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@meta/shared/lib/decorators/public.decorator';
import { TeamICalService } from './ical.service';

@ApiTags('Team iCal')
@Controller()
@UseInterceptors(CacheInterceptor)
@Public()
export class TeamICalController {
  constructor(
    private readonly icalService: TeamICalService,
  ) {}

  @Get()
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="globalevents.ics"')
  @CacheTTL(60 * 60 * 8) // 8 hours in seconds
  public async getAllPublicEventsCalendar(): Promise<string> {
    const calendar = await this.icalService.getAllPublicEventsCalendar();
    return calendar.toString();
  }

  @Get(':id')
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  @Header('Content-Disposition', 'attachment; filename="personnalevents.ics"')
  @CacheTTL(60 * 60 * 8) // 8 hours in seconds
  public async getPersonnalCalendar(@Param('id') id: string): Promise<string> {
    const calendar = await this.icalService.getPersonnalCalendar(id);
    return calendar.toString();
  }
}
