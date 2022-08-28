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

  @Field()
  @IsOptional()
  @IsString()
  @Length(0, 500)
  description?: string;

  @Field(() => GraphQLISODateTime)
  @IsDate()
  payedAt: Date;

  @IsOptional()
  @Field(() => String)
  @IsString()
  payedById: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  @IsString()
  paymentLocation?: string | null = null;

  @IsOptional()
  @Field(() => String, { nullable: true })
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod | null = null;

  @Field(() => Float)
  @IsNumber()
  amount: number;

  @IsOptional()
  @Field(() => Float)
  @IsNumber()
  amountPayed: number;
}
