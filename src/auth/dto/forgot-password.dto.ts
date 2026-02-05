import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 's.balde@hgpd.fr',
    description: 'Adresse email du compte',
  })
  @IsEmail({}, { message: 'Adresse email invalide' })
  email: string;
}
