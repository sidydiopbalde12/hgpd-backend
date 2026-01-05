import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, UpdatePaymentDto } from './dto';
import { PaymentStatus } from '../common/enums';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Get()
  findAll(
    @Query('providerId') providerId?: string,
    @Query('status') status?: PaymentStatus,
  ) {
    return this.paymentsService.findAll({ providerId, status });
  }

  @Get('stats')
  getStats() {
    return this.paymentsService.getStats();
  }

  @Get(':id')
  findById(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findById(id);
  }

  @Get('provider/:providerId')
  findByProvider(@Param('providerId', ParseUUIDPipe) providerId: string) {
    return this.paymentsService.findByProvider(providerId);
  }

  @Get('provider/:providerId/revenue')
  getProviderRevenue(@Param('providerId', ParseUUIDPipe) providerId: string) {
    return this.paymentsService.getProviderTotalRevenue(providerId);
  }

  @Get('wave/:transactionId')
  findByWaveTransactionId(@Param('transactionId') transactionId: string) {
    return this.paymentsService.findByWaveTransactionId(transactionId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(id, dto);
  }

  @Post(':id/complete')
  markAsCompleted(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('waveTransactionId') waveTransactionId?: string,
  ) {
    return this.paymentsService.markAsCompleted(id, waveTransactionId);
  }

  @Post(':id/fail')
  markAsFailed(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.markAsFailed(id);
  }

  @Post(':id/refund')
  refund(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.refund(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.remove(id);
  }
}
