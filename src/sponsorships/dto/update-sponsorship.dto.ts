import {
  IsEnum,
  IsNumber,
  IsDateString,
  IsOptional,
  Min,
} from 'class-validator';
import { SponsorshipStatus } from '../../common/enums';

export class UpdateSponsorshipDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(SponsorshipStatus)
  status?: SponsorshipStatus;
}
