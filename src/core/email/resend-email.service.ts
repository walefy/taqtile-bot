import process from 'node:process';
import fs from 'node:fs';
import path from 'node:path';
import Handlebars from 'handlebars';
import { Resend } from 'resend';
import { EmailSender, SendMailProps } from '@core/contracts';
import { EmailTemplates } from '@domain/email';
import { Service } from 'typedi';

@Service()
export class ResendEmailService implements EmailSender {
  private sdkInstance: Resend;
  private fromEmail: string;
  private templateBasePath = 'src/domain/email/templates';
  private emailQueue: SendMailProps[] = [];
  private isProcessingQueue = false;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;

    if (!apiKey) {
      throw new Error('RESEND_API_KEY not provided');
    }

    if (!fromEmail) {
      throw new Error('RESEND_FROM_EMAIL not provided');
    }

    this.sdkInstance = new Resend(apiKey);
    this.fromEmail = fromEmail;
  }

  async sendMail(props: SendMailProps): Promise<void> {
    this.emailQueue.push(props);

    if (!this.isProcessingQueue) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessingQueue = true;

    while (this.emailQueue.length > 0) {
      const batch = this.emailQueue.splice(0, 2);
      await Promise.all(batch.map((email) => this.sendMailThroughResend(email)));

      await this.delay(1000);
    }

    this.isProcessingQueue = false;
  }

  private async sendMailThroughResend(props: SendMailProps): Promise<void> {
    await this.sdkInstance.emails.send({
      from: this.fromEmail,
      to: props.to,
      subject: props.subject,
      html: this.getTemplate(props.template, props.variables),
    });
  }

  private getTemplate(templateName: EmailTemplates, variables: Record<string, string>): string {
    const template = fs.readFileSync(path.join(this.templateBasePath, templateName + '.html'), 'utf-8');
    const compiledTemplate = Handlebars.compile(template);
    return compiledTemplate(variables);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
