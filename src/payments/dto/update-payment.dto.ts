import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { PaymentStatus } from '../../common/enums';

export class UpdatePaymentDto {
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  waveTransactionId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  wavePaymentUrl?: string;
}
