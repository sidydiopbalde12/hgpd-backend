import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organizer } from './entities/organizer.entity';
import { CreateOrganizerDto, UpdateOrganizerDto } from './dto';

@Injectable()
export class OrganizersService {
  constructor(
    @InjectRepository(Organizer)
    private readonly organizerRepository: Repository<Organizer>,
  ) {}

  async create(dto: CreateOrganizerDto): Promise<Organizer> {
    const organizer = this.organizerRepository.create(dto);
    return this.organizerRepository.save(organizer);
  }

  async findAll(): Promise<Organizer[]> {
    return this.organizerRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Organizer> {
    const organizer = await this.organizerRepository.findOne({
      where: { id },
      relations: ['demands', 'reviews'],
    });
    if (!organizer) {
      throw new NotFoundException(`Organizer with ID ${id} not found`);
    }
    return organizer;
  }

  async findByPhone(phone: string): Promise<Organizer | null> {
    return this.organizerRepository.findOne({
      where: { phone },
    });
  }

  async findOrCreate(dto: CreateOrganizerDto): Promise<Organizer> {
    let organizer = await this.findByPhone(dto.phone);
    if (!organizer) {
      organizer = await this.create(dto);
    }
    return organizer;
  }

  async update(id: string, dto: UpdateOrganizerDto): Promise<Organizer> {
    const organizer = await this.findById(id);
    Object.assign(organizer, dto);
    return this.organizerRepository.save(organizer);
  }

  async remove(id: string): Promise<void> {
    const organizer = await this.findById(id);
    await this.organizerRepository.remove(organizer);
  }

  async getDemandsCount(id: string): Promise<number> {
    const organizer = await this.organizerRepository.findOne({
      where: { id },
      relations: ['demands'],
    });
    return organizer?.demands?.length ?? 0;
  }
}
