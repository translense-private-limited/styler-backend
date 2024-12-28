import { EmailRecipientInterface } from '../interfaces/email-recipient.interface';

export class EmailBuilderDto {
  /**
   * List of recipient email addresses.
   */
  to: EmailRecipientInterface[];

  /**
   * List of CC email addresses.
   */
  cc?: EmailRecipientInterface[];

  /**
   * List of BCC email addresses.
   */
  bcc?: EmailRecipientInterface[];

  /**
   * Subject of the email.
   */
  subject: string;

  /**
   * HTML or plain text body of the email, with placeholders for dynamic data.
   */
  body: string;
}
