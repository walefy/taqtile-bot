import { EmailTemplates } from '@domain/email';

export type SendMailProps = {
  to: string;
  subject: string;
  template: EmailTemplates;
  variables: Record<string, string>;
};

export interface EmailSender {
  sendMail(props: SendMailProps): Promise<void>;
}
