import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateDemandDto } from './create-demand.dto';
import { DemandStatus } from '../../common/enums';

export class UpdateDemandDto extends PartialType(
  OmitType(CreateDemandDto, ['organizerId'] as const),
) {
  @IsOptional()
  @IsEnum(DemandStatus)
  status?: DemandStatus;
}
