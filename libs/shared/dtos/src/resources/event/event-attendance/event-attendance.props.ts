import { Field, InputType } from '@nestjs/graphql';
import { AttendanceConfirmedVia } from '@okampus/shared/enums';
import { IsBoolean, IsEnum } from 'class-validator';

@InputType()
export class EventAttendanceProps {
  @Field(() => Boolean)
  @IsBoolean()
  participated!: boolean;

  @Field(() => AttendanceConfirmedVia)
  @IsEnum(AttendanceConfirmedVia)
  confirmedVia!: AttendanceConfirmedVia;
}
