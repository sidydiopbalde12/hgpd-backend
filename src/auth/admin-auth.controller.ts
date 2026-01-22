import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Ip,
  UseGuards,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ResponseMessage } from '../common/decorators/api-response.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AdminRole } from '../common/enums';
import { AdminLoginDto, RefreshTokenDto, AuthResponseDto } from './dto';

@ApiTags('Auth - Administrateurs')
@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

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
