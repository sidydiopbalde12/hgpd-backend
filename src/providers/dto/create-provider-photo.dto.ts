import {
  IsString,
  IsBoolean,
  IsInt,
  IsOptional,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProviderPhotoDto {
  @IsString()
  @MaxLength(500)
  url: string;

  @IsOptional()
  @IsBoolean()
  isMain?: boolean;

  @IsOptional()
  @IsString()
  photoType?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  displayOrder?: number;
}
