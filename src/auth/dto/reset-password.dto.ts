import { IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty({ description: 'Token de reinitialisation recu par email' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'NouveauMotDePasse123!', description: 'Nouveau mot de passe' })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'Le mot de passe doit contenir au moins 8 caracteres, une majuscule, une minuscule et un chiffre',
  })
  newPassword: string;
}
