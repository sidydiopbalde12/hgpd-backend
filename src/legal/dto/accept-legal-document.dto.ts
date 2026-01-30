import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AcceptLegalDocumentDto {
  @ApiProperty({ example: 'ID prestataire' })
  @IsUUID()
  @IsNotEmpty()
  providerId: string;

  @ApiProperty({ example: 'ID document légal' })
  @IsUUID()
  @IsNotEmpty()
  legalDocumentId: string;

  @ApiProperty({ example: 'Adresse IP' })
  @IsString()
  @IsOptional()
  ipAddress?: string;

  @ApiProperty({ example: 'User-Agent' })
  @IsOptional()
  userAgent?: string;
}
