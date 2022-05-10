import type { PipeTransform } from '@nestjs/common';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isISO8601 } from '../utils/iso-8601-date';

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  public transform(value: Date | string): Date {
    // TODO: Fix automatic parameter parsing, and remove this at the same time.
    if (value instanceof Date && !Number.isNaN(value.getTime()))
      return value;
    if (value === 'today')
      return new Date();
    if (typeof value === 'string' && isISO8601(value))
      return new Date(value);

    throw new BadRequestException('Validation failed (ISO 8601 date is expected)');
  }
}
