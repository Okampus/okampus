import {
  Field,
  Float,
  GraphQLISODateTime,
  InputType,
  Int,
} from '@nestjs/graphql';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { PaymentMethod } from '../../../shared/lib/types/enums/payment-method.enum';
import { CreateFileUploadDto } from '../../file-uploads/dto/create-file-upload.dto';

@InputType()
export class CreateTeamReceiptDto extends CreateFileUploadDto {
  @Field(() => Int)
  @IsInt()
  teamId: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  payedAt: Date;

  @Field(() => String)
  @IsString()
  payedById: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  paymentLocation?: string | null = null;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod | null = null;

  @Field(() => Float)
  @IsNumber()
  amount: number;

  @Field(() => Float)
  @IsNumber()
  amountPayed: number;
}
