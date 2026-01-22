import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { AdminRole } from '../common/enums';

export interface CreateAdminDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: AdminRole;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async create(dto: CreateAdminDto): Promise<Admin> {
    const existing = await this.adminRepository.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new ConflictException('Cet email est deja enregistre');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const admin = this.adminRepository.create({
      ...dto,
      password: hashedPassword,
      role: dto.role || AdminRole.ADMIN,
    });

    const savedAdmin = await this.adminRepository.save(admin);
    this.logger.log(`New admin created: ${savedAdmin.id} (${savedAdmin.role})`);

    return savedAdmin;
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Admin> {
    const admin = await this.adminRepository.findOne({ where: { id } });
    if (!admin) {
      throw new NotFoundException('Admin non trouve');
    }
    return admin;
  }

  async findByEmail(email: string): Promise<Admin | null> {
    return this.adminRepository.findOne({ where: { email } });
  }

  async setActive(id: string, isActive: boolean): Promise<Admin> {
    const admin = await this.findById(id);
    admin.isActive = isActive;
    const updatedAdmin = await this.adminRepository.save(admin);

    this.logger.log(`Admin ${id} active status changed to: ${isActive}`);
    return updatedAdmin;
  }

  async updateRole(id: string, role: AdminRole): Promise<Admin> {
    const admin = await this.findById(id);
    admin.role = role;
    const updatedAdmin = await this.adminRepository.save(admin);

    this.logger.log(`Admin ${id} role changed to: ${role}`);
    return updatedAdmin;
  }

  async updatePassword(id: string, newPassword: string): Promise<void> {
    const admin = await this.findById(id);
    admin.password = await bcrypt.hash(newPassword, 10);
    await this.adminRepository.save(admin);

    this.logger.log(`Admin ${id} password updated`);
  }

  async remove(id: string): Promise<void> {
    const admin = await this.findById(id);
    await this.adminRepository.remove(admin);

    this.logger.log(`Admin ${id} removed`);
  }
}
