import { Injectable, Logger } from '@nestjs/common';
import { EventInterface } from '../interfaces/event.interface';
import { NotificationBuilderService } from './notification-builder.service';

/**
 * The `EventConsumerService` is responsible for consuming events from a source, processing them,
 * and passing them to the `NotificationBuilderService` for further action.
 */
@Injectable()
export class EventConsumerService {
  private logger = new Logger(EventConsumerService.name);
  constructor(private notificationBuilderService: NotificationBuilderService) {}

  /**
   * Consumes an event and processes it.
   * This function acts as the entry point for event consumption. It handles:
   * - Setting up any required queue or event source
   * - Modifying the consumed event data as needed
   * - Delegating the event to the `NotificationBuilderService`
   *
   * @param {EventInterface} event - The event object to be consumed and processed.
   * @returns {Promise<void>} A promise that resolves when the event is fully processed.
   */
  async consume(event: EventInterface): Promise<void> {
    try {
      // Modify the event if needed (e.g., adding metadata, transforming structure)
      this.logger.log('Consuming event:', event);

      // Pass the event to the notification builder for further processing
      await this.notificationBuilderService.notificationBuilder(event);
      this.logger.log('Event processed successfully');
    } catch (error) {
      this.logger.error('Error while consuming event:', error);
      throw error;
    }
  }
}
