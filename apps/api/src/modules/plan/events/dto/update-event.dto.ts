import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { CreateEventDto } from '@plan/events/dto/create-event.dto';

@InputType()
export class UpdateEventDto extends PartialType(OmitType(CreateEventDto, ['templateId'])) {}
