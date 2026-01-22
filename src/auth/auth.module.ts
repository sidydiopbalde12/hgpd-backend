import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { Admin } from './entities/admin.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { PasswordResetToken } from './entities/password-reset-token.entity';
import { EmailVerificationToken } from './entities/email-verification-token.entity';
import { PhoneOtp } from './entities/phone-otp.entity';
import { Provider } from '../providers/entities/provider.entity';

// Services
import { AuthService } from './auth.service';
import { AdminService } from './admin.service';

// Controllers
import { AuthController } from './auth.controller';
import { AdminAuthController } from './admin-auth.controller';

// Strategies & Guards
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { ProviderGuard } from './guards/provider.guard';

// External modules
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      RefreshToken,
      PasswordResetToken,
      EmailVerificationToken,
      PhoneOtp,
      Provider,
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret') || 'default-secret',
        signOptions: {
          expiresIn: 3600, // 1 heure en secondes
        },
      }),
    }),
    MailModule,
  ],
  controllers: [AuthController, AdminAuthController],
  providers: [
    AuthService,
    AdminService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    ProviderGuard,
  ],
  exports: [AuthService, AdminService, JwtAuthGuard, RolesGuard, ProviderGuard],
})
export class AuthModule {}
