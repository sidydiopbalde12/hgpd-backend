import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminRole, UserType } from '../../common/enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<AdminRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Acces refuse');
    }

    // Verifier si c'est un admin
    if (user.type !== UserType.ADMIN) {
      throw new ForbiddenException('Acces reserve aux administrateurs');
    }

    // Verifier le role
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(
        "Vous n'avez pas les permissions necessaires",
      );
    }

    return true;
  }
}
