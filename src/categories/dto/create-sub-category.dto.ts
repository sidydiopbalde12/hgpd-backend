import { IsString, IsInt, MaxLength } from 'class-validator';

export class CreateSubCategoryDto {
  @IsInt()
  categoryId: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(100)
  slug: string;
}
