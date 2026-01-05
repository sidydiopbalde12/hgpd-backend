import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Categories endpoints
  @Post()
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.createCategory(dto);
  }

  @Get()
  findAllCategories() {
    return this.categoriesService.findAllCategories();
  }

  @Get(':id')
  findCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findCategoryById(id);
  }

  @Get('slug/:slug')
  findCategoryBySlug(@Param('slug') slug: string) {
    return this.categoriesService.findCategoryBySlug(slug);
  }

  @Patch(':id')
  updateCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(id, dto);
  }

  @Delete(':id')
  removeCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.removeCategory(id);
  }

  // SubCategories endpoints
  @Post('sub-categories')
  createSubCategory(@Body() dto: CreateSubCategoryDto) {
    return this.categoriesService.createSubCategory(dto);
  }

  @Get('sub-categories/all')
  findAllSubCategories(@Query('categoryId') categoryId?: string) {
    return this.categoriesService.findAllSubCategories(
      categoryId ? parseInt(categoryId, 10) : undefined,
    );
  }

  @Get('sub-categories/:id')
  findSubCategoryById(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findSubCategoryById(id);
  }

  @Patch('sub-categories/:id')
  updateSubCategory(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.categoriesService.updateSubCategory(id, dto);
  }

  @Delete('sub-categories/:id')
  removeSubCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.removeSubCategory(id);
  }
}
