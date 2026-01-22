import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({ description: 'Token de verification recu par email' })
  @IsString()
  token: string;
}

export class ResendVerificationDto {
  @ApiProperty({ example: 's.balde@hgpd.fr', description: 'Adresse email a verifier' })
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;
}
