import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment } from './entities/payment.entity';
import { forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsModule } from '../events/events.module';
import { DemandsModule } from '../demands/demands.module';

import { Admin } from '../auth/entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, Admin]),
    NotificationsModule,
    EventsModule,
    forwardRef(() => DemandsModule),
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule { }
