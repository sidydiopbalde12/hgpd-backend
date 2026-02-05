import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateOrganizerDto {
  @ApiProperty({ example: 'Sidy' })
  @IsString()
  @MaxLength(100)
  firstName: string;

  @ApiProperty({ example: 'Balde' })
  @IsString()
  @MaxLength(100)
  lastName: string;

  @ApiProperty({ example: '+221770000000' })
  @IsString()
  @MaxLength(20)
  phone: string;

  @ApiProperty({ example: 's.balde@hgpd.fr' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiProperty({ example: 'Dakar' })
  @IsString()
  @MaxLength(100)
  department: string;

  @ApiProperty({ example: "Pattes d'oie" })
  @IsString()
  @MaxLength(100)
  commune: string;
}
