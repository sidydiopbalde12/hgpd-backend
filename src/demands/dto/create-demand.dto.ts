import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsInt,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateDemandDto {
  @IsString()
  organizerId: string;

  @IsString()
  @MaxLength(200)
  contactName: string;

  @IsString()
  @MaxLength(200)
  eventNature: string;

  @IsDateString()
  eventDate: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  approximateGuests?: number;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  geographicZone?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @IsOptional()
  @IsString()
  additionalInfo?: string;
}
