import { IsEnum, IsOptional } from 'class-validator';
import { SupportStatus } from '../../common/enums';

export class UpdateSupportRequestDto {
  @IsOptional()
  @IsEnum(SupportStatus)
  status?: SupportStatus;
}
