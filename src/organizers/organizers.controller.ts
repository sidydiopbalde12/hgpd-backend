import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { CreateOrganizerDto, UpdateOrganizerDto } from './dto';

@Controller('organizers')
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}

  @Post()
  create(@Body() dto: CreateOrganizerDto) {
    return this.organizersService.create(dto);
  }

  @Get()
  findAll() {
    return this.organizersService.findAll();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizersService.findById(id);
  }

  @Get(':id/demands-count')
  getDemandsCount(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizersService.getDemandsCount(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateOrganizerDto,
  ) {
    return this.organizersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizersService.remove(id);
  }
}
