import {
  IsEnum,
  IsUUID,
  IsDateString,
  IsOptional,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { SubscriptionPlan } from '../../common/enums';

export class CreateSubscriptionDto {
  @IsUUID()
  providerId: string;

  @IsEnum(SubscriptionPlan)
  plan: SubscriptionPlan;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  waveTransactionId?: string;
}
