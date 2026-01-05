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
} from '@nestjs/common';
import { SupportService } from './support.service';
import { CreateSupportRequestDto, UpdateSupportRequestDto } from './dto';
import { SupportStatus } from '../common/enums';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  create(@Body() dto: CreateSupportRequestDto) {
    return this.supportService.create(dto);
  }

  @Get()
  findAll(
    @Query('providerId') providerId?: string,
    @Query('status') status?: SupportStatus,
  ) {
    return this.supportService.findAll({ providerId, status });
  }

  @Get('stats')
  getStats() {
    return this.supportService.getStats();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.supportService.findById(id);
  }

  @Get('provider/:providerId')
  findByProvider(@Param('providerId', ParseUUIDPipe) providerId: string) {
    return this.supportService.findByProvider(providerId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupportRequestDto,
  ) {
    return this.supportService.update(id, dto);
  }

  @Post(':id/resolve')
  resolve(@Param('id', ParseUUIDPipe) id: string) {
    return this.supportService.resolve(id);
  }

  @Post(':id/close')
  close(@Param('id', ParseUUIDPipe) id: string) {
    return this.supportService.close(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.supportService.remove(id);
  }
}
