import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Demand } from '../demands/entities/demand.entity';
import { Provider } from '../providers/entities/provider.entity';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly mailerService: MailerService) {}

  async sendDemandNotification(
    provider: Provider,
    demand: Demand,
  ): Promise<void> {
    if (!provider.email) {
      this.logger.warn(
        `Provider ${provider.id} has no email address, skipping notification`,
      );
      return;
    }

    try {
      await this.mailerService.sendMail({
        to: provider.email,
        subject: `Nouvelle demande de prestation - ${demand.eventNature}`,
        template: 'new-demand',
        context: {
          providerName: `${provider.firstName} ${provider.lastName}`,
          companyName: provider.companyName,
          contactName: demand.contactName,
          eventNature: demand.eventNature,
          eventDate: this.formatDate(new Date(demand.eventDate)),
          approximateGuests: demand.approximateGuests || 'Non spécifié',
          location: demand.location || 'Non spécifié',
          geographicZone: demand.geographicZone || 'Non spécifié',
          budget: demand.budget ? this.formatCurrency(demand.budget) : 'Non spécifié',
          additionalInfo: demand.additionalInfo || 'Aucune information supplémentaire',
          year: new Date().getFullYear(),
        },
      });

      this.logger.log(
        `Demand notification sent to provider ${provider.email} for demand ${demand.id}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send demand notification to ${provider.email}: ${error.message}`,
      );
      throw error;
    }
  }

  async sendDemandNotificationToMultipleProviders(
    providers: Provider[],
    demand: Demand,
  ): Promise<{ success: string[]; failed: string[] }> {
    const results = { success: [] as string[], failed: [] as string[] };

    for (const provider of providers) {
      try {
        await this.sendDemandNotification(provider, demand);
        if (provider.email) {
          results.success.push(provider.email);
        }
      } catch {
        if (provider.email) {
          results.failed.push(provider.email);
        }
      }
    }

    return results;
  }

  private formatDate(date: Date): string {
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  }
}
