import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsInt,
  MaxLength,
  Min,
  IsArray,
  IsUUID,
  ArrayMinSize,
} from 'class-validator';

export class CreateDemandDto {
  @ApiProperty({ example: 'organizerId' })
  @IsString()
  organizerId: string;

  @ApiProperty({ example: 'Mouhamed Ngom' })
  @IsString()
  @MaxLength(200)
  contactName: string;

  @ApiProperty({ example: 'Marriage' })
  @IsString()
  @MaxLength(200)
  eventNature: string;

  @ApiProperty({ example: '2026-12-31T18:30:00Z' })
  @IsDateString()
  eventDate: string;

  @ApiProperty({ example: 150 })
  @IsOptional()
  @IsInt()
  @Min(1)
  approximateGuests?: number;

  @ApiProperty({ example: 'Tivaoune Peuhl' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  location?: string;

  @ApiProperty({ example: 'Downtown area' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  geographicZone?: string;

  @ApiProperty({ example: 500000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  budget?: number;

  @ApiProperty({ example: 'Information supplémentaire sur l\'événement' })
  @IsOptional()
  @IsString()
  additionalInfo?: string;

  @ApiProperty({
    example: ['uuid-provider-1', 'uuid-provider-2'],
    description: 'Liste des IDs des prestataires à notifier',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  @ArrayMinSize(1)
  providerIds?: string[];
}
