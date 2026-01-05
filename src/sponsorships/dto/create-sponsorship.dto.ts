import {
  IsUUID,
  IsNumber,
  IsDateString,
  IsInt,
  Min,
} from 'class-validator';

export class CreateSponsorshipDto {
  @IsUUID()
  providerId: string;

  @IsInt()
  categoryId: number;

  @IsNumber()
  @Min(0)
  budget: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}
