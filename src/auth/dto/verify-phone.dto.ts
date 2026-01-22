import { IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendOtpDto {
  @ApiProperty({ example: '+221770000000', description: 'Numero de telephone' })
  @IsString()
  @Matches(/^\+?[0-9]{9,15}$/, { message: 'Numero de telephone invalide' })
  phone: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '+221770000000', description: 'Numero de telephone' })
  @IsString()
  @Matches(/^\+?[0-9]{9,15}$/, { message: 'Numero de telephone invalide' })
  phone: string;

  @ApiProperty({ example: '123456', description: 'Code OTP a 6 chiffres' })
  @IsString()
  @Length(6, 6, { message: 'Le code OTP doit contenir 6 chiffres' })
  otp: string;
}
