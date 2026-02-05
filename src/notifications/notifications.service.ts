import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) { }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: {
        recipientId: userId,
        readAt: IsNull(),
      },
    });
  }

  async findAll(userId: string, options: { limit?: number; offset?: number } = {}): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { recipientId: userId },
      order: { createdAt: 'DESC' },
      take: options.limit || 50,
      skip: options.offset || 0,
    });
  }

  async markAsRead(notificationId: string, userId: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipientId: userId },
    });
    if (!notification) {
      throw new Error('Notification non trouvée');
    }
    notification.readAt = new Date();
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.update(
      { recipientId: userId, readAt: IsNull() },
      { readAt: new Date() },
    );
  }

  async createNotification(data: {
    recipientId: string;
    recipientType: string;
    type: any; // NotificationType
    channel: any; // NotificationChannel
    content: Record<string, any>;
  }): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...data,
      sentAt: new Date(),
    });
    return this.notificationRepository.save(notification);
  }
}
