import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { ProvidersService } from './providers.service';
import {
  CreateProviderDto,
  UpdateProviderDto,
  CreateProviderPhotoDto,
  CreateProviderVideoDto,
  AddProviderCategoryDto,
} from './dto';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  create(@Body() dto: CreateProviderDto) {
    return this.providersService.create(dto);
  }

  @Get()
  findAll(
    @Query('department') department?: string,
    @Query('categoryId') categoryId?: string,
    @Query('isActive') isActive?: string,
  ) {
    return this.providersService.findAll({
      department,
      categoryId: categoryId ? parseInt(categoryId, 10) : undefined,
      isActive: isActive ? isActive === 'true' : undefined,
    });
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.providersService.findById(id);
  }

  @Get(':id/stats')
  getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.providersService.getStats(id);
  }

  @Post(':id/view')
  incrementViews(@Param('id', ParseUUIDPipe) id: string) {
    return this.providersService.incrementProfileViews(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProviderDto,
  ) {
    return this.providersService.update(id, dto);
  }

  @Patch(':id/active')
  setActive(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('isActive', ParseBoolPipe) isActive: boolean,
  ) {
    return this.providersService.setActive(id, isActive);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.providersService.remove(id);
  }

  // Photos
  @Post(':id/photos')
  addPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateProviderPhotoDto,
  ) {
    return this.providersService.addPhoto(id, dto);
  }

  @Delete(':id/photos/:photoId')
  removePhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('photoId', ParseUUIDPipe) photoId: string,
  ) {
    return this.providersService.removePhoto(id, photoId);
  }

  @Patch(':id/photos/:photoId/main')
  setMainPhoto(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('photoId', ParseUUIDPipe) photoId: string,
  ) {
    return this.providersService.setMainPhoto(id, photoId);
  }

  // Videos
  @Post(':id/videos')
  addVideo(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateProviderVideoDto,
  ) {
    return this.providersService.addVideo(id, dto);
  }

  @Delete(':id/videos/:videoId')
  removeVideo(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('videoId', ParseUUIDPipe) videoId: string,
  ) {
    return this.providersService.removeVideo(id, videoId);
  }

  // Categories
  @Post(':id/categories')
  addCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AddProviderCategoryDto,
  ) {
    return this.providersService.addCategory(id, dto);
  }

  @Delete(':id/categories/:pcId')
  removeCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('pcId', ParseIntPipe) pcId: number,
  ) {
    return this.providersService.removeCategory(id, pcId);
  }
}
