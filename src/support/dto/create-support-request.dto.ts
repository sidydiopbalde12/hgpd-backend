import { IsString, IsEnum, IsUUID } from 'class-validator';
import { SupportSubject, PreferredContact } from '../../common/enums';

export class CreateSupportRequestDto {
  @IsUUID()
  providerId: string;

  @IsEnum(SupportSubject)
  subject: SupportSubject;

  @IsString()
  description: string;

  @IsEnum(PreferredContact)
  preferredContact: PreferredContact;
}
