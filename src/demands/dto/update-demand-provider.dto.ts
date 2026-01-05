import { IsEnum, IsOptional, IsString, IsBoolean } from 'class-validator';
import { DemandStatus, NonConversionReason } from '../../common/enums';

export class UpdateDemandProviderDto {
  @IsOptional()
  @IsEnum(DemandStatus)
  status?: DemandStatus;

  @IsOptional()
  @IsString()
  providerResponse?: string;

  @IsOptional()
  @IsBoolean()
  convertedToMission?: boolean;

  @IsOptional()
  @IsEnum(NonConversionReason)
  nonConversionReason?: NonConversionReason;

  @IsOptional()
  @IsString()
  nonConversionComment?: string;
}
