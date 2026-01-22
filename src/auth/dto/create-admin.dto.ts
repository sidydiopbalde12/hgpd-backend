import {
  IsString,
  IsEmail,
  IsEnum,
  IsOptional,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AdminRole } from '../../common/enums';

export class CreateAdminDto {
  @ApiProperty({ example: 'Sidy', description: 'Prenom' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Balde', description: 'Nom' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: 'admin@hgpd.com', description: 'Email administrateur' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'AdminPassword123!',
    description: 'Mot de passe (min 8 caracteres, 1 majuscule, 1 minuscule, 1 chiffre)',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message:
      'Le mot de passe doit contenir au moins 8 caracteres, une majuscule, une minuscule et un chiffre',
  })
  password: string;

  @ApiPropertyOptional({
    enum: AdminRole,
    example: AdminRole.ADMIN,
    description: 'Role administrateur',
  })
  @IsOptional()
  @IsEnum(AdminRole)
  role?: AdminRole;
}
