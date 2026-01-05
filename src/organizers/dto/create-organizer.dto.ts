import { IsString, IsOptional, IsEmail, MaxLength } from 'class-validator';

export class CreateOrganizerDto {
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsString()
  @MaxLength(100)
  department: string;

  @IsString()
  @MaxLength(100)
  commune: string;
}
