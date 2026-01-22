import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { UserType } from '../../common/enums';

export interface JwtPayload {
  sub: string;
  type: UserType;
  iat?: number;
  exp?: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.secret') || 'default-secret',
    });
  }

  async validate(payload: JwtPayload) {
    let user;

    if (payload.type === UserType.PROVIDER) {
      user = await this.authService.validateProvider(payload.sub);
    } else if (payload.type === UserType.ADMIN) {
      user = await this.authService.validateAdmin(payload.sub);
    }

    if (!user) {
      throw new UnauthorizedException('Utilisateur non trouve ou inactif');
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      type: payload.type,
      role: 'role' in user ? user.role : undefined,
    };
  }
}
