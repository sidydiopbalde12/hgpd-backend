import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProviderLoginDto {
  @ApiProperty({ example: '+221770000000', description: 'Email ou numero de telephone' })
  @IsString()
  identifier: string;

  @ApiProperty({ example: 'MotDePasse123!', description: 'Mot de passe' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0...', description: 'Informations sur le device' })
  @IsOptional()
  @IsString()
  deviceInfo?: string;
}
