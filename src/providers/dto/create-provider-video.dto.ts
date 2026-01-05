import { IsString, IsInt, IsOptional, MaxLength, Min } from 'class-validator';

export class CreateProviderVideoDto {
  @IsString()
  @MaxLength(500)
  url: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
