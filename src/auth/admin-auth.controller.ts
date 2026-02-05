import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Ip,
  UseGuards,
  Get,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AdminService } from './admin.service';
import { ResponseMessage } from '../common/decorators/api-response.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AdminRole } from '../common/enums';
import {
  AdminLoginDto,
  CreateAdminDto,
  RefreshTokenDto,
  AuthResponseDto,
} from './dto';
import { Admin } from './entities/admin.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@ApiTags('Auth - Administrateurs')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly adminService: AdminService,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  @Post('setup')
  @ApiOperation({
    summary: 'Creer le premier SUPER_ADMIN (uniquement si aucun admin existe)',
  })
  @ApiResponse({
    status: 201,
    description: 'Premier administrateur cree avec succes',
  })
  @ApiResponse({
    status: 403,
    description: 'Des administrateurs existent deja',
  })
  @ApiResponse({ status: 409, description: 'Email deja utilise' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Premier administrateur cree avec succes')
  async setupFirstAdmin(
    @Body() dto: CreateAdminDto,
  ): Promise<Omit<Admin, 'password'>> {
    // Verifier si des admins existent deja
    const adminCount = await this.adminRepository.count();
    if (adminCount > 0) {
      throw new ForbiddenException(
        'Des administrateurs existent deja. Utilisez /admin/auth/register avec un compte SUPER_ADMIN.',
      );
    }

    // Forcer le role SUPER_ADMIN pour le premier admin
    const admin = await this.adminService.create({
      ...dto,
      role: AdminRole.SUPER_ADMIN,
    });

    const { password, ...result } = admin;
    return result;
  }

  @Post('register')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Creer un nouvel administrateur (SUPER_ADMIN uniquement)',
  })
  @ApiResponse({
    status: 201,
    description: 'Administrateur cree avec succes',
  })
  @ApiResponse({ status: 401, description: 'Non authentifie' })
  @ApiResponse({
    status: 403,
    description: 'Acces refuse - SUPER_ADMIN requis',
  })
  @ApiResponse({ status: 409, description: 'Email deja utilise' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Administrateur cree avec succes')
  async createAdmin(
    @Body() dto: CreateAdminDto,
  ): Promise<Omit<Admin, 'password'>> {
    const admin = await this.adminService.create(dto);
    // Ne pas retourner le mot de passe
    const { password, ...result } = admin;
    return result;
  }

  @Post('login')
  @ApiOperation({ summary: 'Connexion administrateur' })
  @ApiResponse({
    status: 200,
    description: 'Connexion reussie',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Connexion reussie')
  async loginAdmin(
    @Body() dto: AdminLoginDto,
    @Ip() ip: string,
  ): Promise<AuthResponseDto> {
    return this.authService.loginAdmin(dto, ip);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deconnexion admin' })
  @ApiResponse({ status: 200, description: 'Deconnexion reussie' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Deconnexion reussie')
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(AdminRole.SUPER_ADMIN, AdminRole.ADMIN, AdminRole.MODERATOR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil admin connecte' })
  @ApiResponse({ status: 200, description: 'Profil recupere avec succes' })
  @ApiResponse({ status: 401, description: 'Non authentifie' })
  @ApiResponse({ status: 403, description: 'Acces refuse' })
  @ResponseMessage('Profil recupere avec succes')
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
