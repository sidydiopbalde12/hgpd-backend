import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Get()
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findById(id);
  }

  @Get('provider/:providerId')
  findByProvider(@Param('providerId', ParseUUIDPipe) providerId: string) {
    return this.reviewsService.findByProvider(providerId);
  }

  @Get('provider/:providerId/summary')
  getProviderSummary(@Param('providerId', ParseUUIDPipe) providerId: string) {
    return this.reviewsService.getProviderRatingSummary(providerId);
  }

  @Get('organizer/:organizerId')
  findByOrganizer(@Param('organizerId', ParseUUIDPipe) organizerId: string) {
    return this.reviewsService.findByOrganizer(organizerId);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}
