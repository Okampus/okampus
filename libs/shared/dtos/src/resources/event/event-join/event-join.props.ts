import { Field, InputType } from '@nestjs/graphql';
import { AttendanceStatus } from '@okampus/shared/enums';
import { IsEnum } from 'class-validator';

@InputType()
export class EventJoinProps {
  @Field(() => AttendanceStatus, { nullable: true })
  @IsEnum(AttendanceStatus)
  attendanceStatus!: AttendanceStatus;
}
