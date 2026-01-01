import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Sidy' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Balde' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'sidy@hgpd.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+221771234567', required: false })
  @IsOptional()
  @IsString()
  whatsapp?: string;
}