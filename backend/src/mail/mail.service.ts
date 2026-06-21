import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter;
  private readonly from: string;

  constructor(private config: ConfigService) {
    this.from = this.config.get<string>('MAIL_FROM') ?? 'Jiwar Aloula <no-reply@jiwar1st.com>';
    this.transporter = createTransport({
      host: this.config.get<string>('SMTP_HOST'),
      port: Number(this.config.get<string>('SMTP_PORT') ?? 465),
      secure: this.config.get<string>('SMTP_SECURE') !== 'false',
      auth: {
        user: this.config.get<string>('SMTP_USER'),
        pass: this.config.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendNewPasswordEmail(to: string, name: string, newPassword: string) {
    const adminBaseUrl = this.config.get<string>('ADMIN_BASE_URL') ?? 'http://localhost:5173/admin.html';
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'Your Jiwar Aloula admin password has been reset',
      text: `Hello ${name},\n\nA new password for your Jiwar Aloula admin account has been generated:\n\n${newPassword}\n\nSign in at ${adminBaseUrl} and change it from Settings once you're in.\n\nIf you didn't request this, contact your system administrator immediately.`,
      html: `<p>Hello ${name},</p>
<p>A new password for your Jiwar Aloula admin account has been generated:</p>
<p style="font-size:18px;font-weight:700;letter-spacing:.04em;background:#f5f3f5;padding:12px 16px;border-radius:8px;display:inline-block">${newPassword}</p>
<p>Sign in at <a href="${adminBaseUrl}">${adminBaseUrl}</a> and change it from Settings once you're in.</p>
<p style="color:#877271;font-size:13px">If you didn't request this, contact your system administrator immediately.</p>`,
    });
    this.logger.log(`Password reset email sent to ${to}`);
  }
}
