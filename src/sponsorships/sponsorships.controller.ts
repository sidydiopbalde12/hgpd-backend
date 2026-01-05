import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
} from '@nestjs/common';
import { SponsorshipsService } from './sponsorships.service';
import { CreateSponsorshipDto, UpdateSponsorshipDto } from './dto';

@Controller('sponsorships')
export class SponsorshipsController {
  constructor(private readonly sponsorshipsService: SponsorshipsService) {}

  @Post()
  create(@Body() createSponsorshipDto: CreateSponsorshipDto) {
    return this.sponsorshipsService.create(createSponsorshipDto);
  }

  @Get()
  findAll(
    @Query('providerId') providerId?: string,
    @Query('categoryId') categoryId?: string,
  ) {
    return this.sponsorshipsService.findAll(
      providerId,
      categoryId ? parseInt(categoryId, 10) : undefined,
    );
  }

  @Get('category/:categoryId/active')
  findActiveByCategory(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.sponsorshipsService.findActiveByCategory(categoryId);
  }

  @Get('provider/:providerId/active')
  findActiveByProvider(@Param('providerId', ParseUUIDPipe) providerId: string) {
    return this.sponsorshipsService.findActiveByProvider(providerId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sponsorshipsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSponsorshipDto: UpdateSponsorshipDto,
  ) {
    return this.sponsorshipsService.update(id, updateSponsorshipDto);
  }

  @Patch(':id/pause')
  pause(@Param('id', ParseUUIDPipe) id: string) {
    return this.sponsorshipsService.pause(id);
  }

  @Patch(':id/resume')
  resume(@Param('id', ParseUUIDPipe) id: string) {
    return this.sponsorshipsService.resume(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sponsorshipsService.remove(id);
  }
}
