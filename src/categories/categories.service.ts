import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { SubCategory } from './entities/sub-category.entity';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from './dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(SubCategory)
    private readonly subCategoryRepository: Repository<SubCategory>,
  ) {}

  // Categories CRUD
  async createCategory(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoryRepository.create(dto);
    return this.categoryRepository.save(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.find({
      order: { displayOrder: 'ASC' },
      relations: ['subCategories'],
    });
  }

  /**
   * Get all categories with provider counts
   */
  async findAllCategoriesWithProviderCounts(): Promise<any[]> {
    const categories = await this.categoryRepository.find({
      order: { displayOrder: 'ASC' },
      relations: ['subCategories'],
    });

    // Get provider counts for each category
    const results = await Promise.all(
      categories.map(async (category) => {
        const count = await this.categoryRepository.query(
          `
          SELECT COUNT(DISTINCT pc.provider_id) as provider_count
          FROM provider_categories pc
          WHERE pc.category_id = $1
        `,
          [category.id],
        );

        return {
          ...category,
          providerCount: parseInt(count[0]?.provider_count || '0'),
        };
      }),
    );

    return results;
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['subCategories'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async findCategoryBySlug(slug: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { slug },
      relations: ['subCategories'],
    });
    if (!category) {
      throw new NotFoundException(`Category with slug ${slug} not found`);
    }
    return category;
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findCategoryById(id);
    Object.assign(category, dto);
    return this.categoryRepository.save(category);
  }

  async removeCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoryRepository.remove(category);
  }

  // SubCategories CRUD
  async createSubCategory(dto: CreateSubCategoryDto): Promise<SubCategory> {
    await this.findCategoryById(dto.categoryId);
    const subCategory = this.subCategoryRepository.create(dto);
    return this.subCategoryRepository.save(subCategory);
  }

  async findAllSubCategories(categoryId?: number): Promise<SubCategory[]> {
    const query = this.subCategoryRepository
      .createQueryBuilder('subCategory')
      .leftJoinAndSelect('subCategory.category', 'category');

    if (categoryId) {
      query.where('subCategory.categoryId = :categoryId', { categoryId });
    }

    return query.orderBy('category.displayOrder', 'ASC').getMany();
  }

  async findSubCategoryById(id: number): Promise<SubCategory> {
    const subCategory = await this.subCategoryRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!subCategory) {
      throw new NotFoundException(`SubCategory with ID ${id} not found`);
    }
    return subCategory;
  }

  async updateSubCategory(
    id: number,
    dto: UpdateSubCategoryDto,
  ): Promise<SubCategory> {
    const subCategory = await this.findSubCategoryById(id);
    Object.assign(subCategory, dto);
    return this.subCategoryRepository.save(subCategory);
  }

  async removeSubCategory(id: number): Promise<void> {
    const subCategory = await this.findSubCategoryById(id);
    await this.subCategoryRepository.remove(subCategory);
  }
}
