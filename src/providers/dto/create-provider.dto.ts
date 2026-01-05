import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  IsBoolean,
  MaxLength,
  MinLength,
} from 'class-validator';
import { IdentityDocType } from '../../common/enums';

export class CreateProviderDto {
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsString()
  @MaxLength(200)
  companyName: string;

  @IsString()
  @MaxLength(200)
  activity: string;

  @IsString()
  @MaxLength(100)
  department: string;

  @IsString()
  @MaxLength(100)
  commune: string;

  @IsString()
  @MaxLength(20)
  phone: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(IdentityDocType)
  identityDocType: IdentityDocType;

  @IsString()
  @MaxLength(50)
  identityDocNumber: string;

  @IsOptional()
  @IsBoolean()
  showPhoneNumber?: boolean;
}
