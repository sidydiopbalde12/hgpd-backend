import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateSubCategoryDto } from './create-sub-category.dto';

export class UpdateSubCategoryDto extends PartialType(
  OmitType(CreateSubCategoryDto, ['categoryId'] as const),
) {}
