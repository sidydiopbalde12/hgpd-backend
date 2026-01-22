import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ example: 'admin@hgpd.com', description: 'Email administrateur' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;

  @ApiProperty({ example: 'AdminPassword123!', description: 'Mot de passe' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0...', description: 'Informations sur le device' })
  @IsOptional()
  @IsString()
  deviceInfo?: string;
}
