import { IsInt, IsOptional } from 'class-validator';

export class AddProviderCategoryDto {
  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsInt()
  subCategoryId?: number;
}
