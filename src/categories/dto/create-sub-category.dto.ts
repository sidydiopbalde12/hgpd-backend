import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, MaxLength } from 'class-validator';

export class CreateSubCategoryDto {
  @IsInt()
  categoryId: number;

  @ApiProperty({ example: 'name' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'slug' })
  @IsString()
  @MaxLength(100)
  slug: string;
}
