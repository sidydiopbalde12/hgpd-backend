import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserType } from '../../common/enums';

@Injectable()
export class ProviderGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('Acces refuse');
    }

    if (user.type !== UserType.PROVIDER) {
      throw new ForbiddenException('Acces reserve aux prestataires');
    }

    return true;
  }
}
