import { IsEnum, IsNotEmpty, IsString, MaxLength, IsOptional, IsBoolean } from 'class-validator';
import { LegalDocumentType } from '../entities/legal-document.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLegalDocumentDto {
  @ApiProperty({ example: 'CGU' })
  @IsEnum(LegalDocumentType)
  @IsNotEmpty()
  type: LegalDocumentType;

  @ApiProperty({ example: 'Conditions Générales d\'Utilisation' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Le contenu des CGU...' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: 'v1.0' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  version: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
