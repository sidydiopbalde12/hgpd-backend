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
import { CurrentUser } from './decorators/current-user.decorator';
import {
  ProviderRegisterDto,
  ProviderLoginDto,
  RefreshTokenDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
  ResendVerificationDto,
  AuthResponseDto,
  TokensResponseDto,
} from './dto';

@ApiTags('Auth - Prestataires')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('provider/register')
  @ApiOperation({ summary: 'Inscription prestataire' })
  @ApiResponse({
    status: 201,
    description: 'Prestataire inscrit avec succes',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 409, description: 'Email ou telephone deja utilise' })
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Inscription reussie')
  async registerProvider(
    @Body() dto: ProviderRegisterDto,
    @Ip() ip: string,
  ): Promise<AuthResponseDto> {
    return this.authService.registerProvider(dto, ip);
  }

  @Post('provider/login')
  @ApiOperation({ summary: 'Connexion prestataire (email ou telephone)' })
  @ApiResponse({
    status: 200,
    description: 'Connexion reussie',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Connexion reussie')
  async loginProvider(
    @Body() dto: ProviderLoginDto,
    @Ip() ip: string,
  ): Promise<AuthResponseDto> {
    return this.authService.loginProvider(dto, ip);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Rafraichir les tokens' })
  @ApiResponse({
    status: 200,
    description: 'Tokens rafraichis',
    type: TokensResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Refresh token invalide ou expire' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Tokens rafraichis avec succes')
  async refreshTokens(
    @Body() dto: RefreshTokenDto,
    @Ip() ip: string,
  ): Promise<TokensResponseDto> {
    return this.authService.refreshTokens(dto.refreshToken, ip);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deconnexion' })
  @ApiResponse({ status: 200, description: 'Deconnexion reussie' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Deconnexion reussie')
  async logout(@Body() dto: RefreshTokenDto): Promise<void> {
    return this.authService.logout(dto.refreshToken);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Demande de reinitialisation de mot de passe' })
  @ApiResponse({
    status: 200,
    description: 'Email envoye si le compte existe',
  })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage(
    'Si cet email existe, un lien de reinitialisation a ete envoye',
  )
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<void> {
    await this.authService.forgotPassword(dto.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reinitialiser le mot de passe' })
  @ApiResponse({
    status: 200,
    description: 'Mot de passe reinitialise avec succes',
  })
  @ApiResponse({ status: 400, description: 'Token invalide ou expire' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Mot de passe reinitialise avec succes')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    return this.authService.resetPassword(dto.token, dto.newPassword);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verifier email via token' })
  @ApiResponse({ status: 200, description: 'Email verifie avec succes' })
  @ApiResponse({ status: 400, description: 'Token invalide ou expire' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email verifie avec succes')
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<void> {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('resend-verification')
  @ApiOperation({ summary: 'Renvoyer email de verification' })
  @ApiResponse({ status: 200, description: 'Email de verification renvoye' })
  @ApiResponse({ status: 404, description: 'Prestataire non trouve' })
  @ApiResponse({ status: 400, description: 'Email deja verifie' })
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Email de verification renvoye')
  async resendVerification(@Body() dto: ResendVerificationDto): Promise<void> {
    return this.authService.resendEmailVerification(dto.email);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Profil utilisateur connecte' })
  @ApiResponse({ status: 200, description: 'Profil recupere avec succes' })
  @ApiResponse({ status: 401, description: 'Non authentifie' })
  @ResponseMessage('Profil recupere avec succes')
  async getProfile(@CurrentUser() user: any) {
    return user;
  }
}
