import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional, IsBoolean } from 'class-validator';

export class UpdateLegalDocumentDto {
  @ApiProperty({ example: 'title' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string;

  @ApiProperty({ example: 'content' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ example: 'version' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  version?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
