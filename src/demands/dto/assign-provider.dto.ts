import { IsString, IsUUID } from 'class-validator';

export class AssignProviderDto {
  @IsUUID()
  providerId: string;
}
