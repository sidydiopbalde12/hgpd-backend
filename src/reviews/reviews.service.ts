import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    const existing = await this.reviewRepository.findOne({
      where: { demandProviderId: dto.demandProviderId },
    });
    if (existing) {
      throw new ConflictException('Review already exists for this demand');
    }

    const review = this.reviewRepository.create(dto);
    return this.reviewRepository.save(review);
  }

  async findAll(): Promise<Review[]> {
    return this.reviewRepository.find({
      relations: ['organizer', 'provider', 'demandProvider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id },
      relations: ['organizer', 'provider', 'demandProvider'],
    });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }
    return review;
  }

  async findByProvider(providerId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { providerId },
      relations: ['organizer', 'demandProvider'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByOrganizer(organizerId: string): Promise<Review[]> {
    return this.reviewRepository.find({
      where: { organizerId },
      relations: ['provider', 'demandProvider'],
      order: { createdAt: 'DESC' },
    });
  }

  async getProviderRatingSummary(providerId: string): Promise<{
    averageRating: number;
    totalReviews: number;
    recommendationRate: number;
    ratingDistribution: Record<number, number>;
  }> {
    const reviews = await this.reviewRepository.find({
      where: { providerId },
    });

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        recommendationRate: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.globalRating, 0);
    const recommendations = reviews.filter((r) => r.wouldRecommend).length;
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      distribution[r.globalRating]++;
    });

    return {
      averageRating: Math.round((totalRating / reviews.length) * 10) / 10,
      totalReviews: reviews.length,
      recommendationRate: Math.round((recommendations / reviews.length) * 100),
      ratingDistribution: distribution,
    };
  }

  async remove(id: string): Promise<void> {
    const review = await this.findById(id);
    await this.reviewRepository.remove(review);
  }
}
