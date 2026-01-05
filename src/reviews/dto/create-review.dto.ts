import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsUUID,
  Min,
  Max,
} from 'class-validator';

export class CreateReviewDto {
  @IsUUID()
  demandProviderId: string;

  @IsUUID()
  organizerId: string;

  @IsUUID()
  providerId: string;

  @IsInt()
  @Min(1)
  @Max(5)
  globalRating: number;

  @IsInt()
  @Min(0)
  @Max(1)
  punctuality: number;

  @IsInt()
  @Min(0)
  @Max(1)
  respectCommunication: number;

  @IsInt()
  @Min(0)
  @Max(1)
  requestCompliance: number;

  @IsInt()
  @Min(0)
  @Max(1)
  serviceQuality: number;

  @IsInt()
  @Min(0)
  @Max(1)
  regrettableIncident: number;

  @IsBoolean()
  wouldRecommend: boolean;

  @IsOptional()
  @IsString()
  comment?: string;
}
