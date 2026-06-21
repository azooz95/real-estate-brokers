import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { MailService } from '../../mail/mail.service';
import { generatePassword } from '../../common/random-password.util';
import { LoginDto } from './dto/login.dto';
import { UpdateAccountDto } from './dto/update-account.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService, private mail: MailService) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.adminUser.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid email or password');

    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role });
    return { token, user: { name: user.name, role: user.role } };
  }

  // Generates a new password, persists it, and emails it to the registered
  // address. Silently no-ops for unknown emails so the endpoint can't be used
  // to enumerate which admin accounts exist.
  async forgotPassword(email: string) {
    const user = await this.prisma.adminUser.findUnique({ where: { email } });
    if (!user) return;

    const newPassword = generatePassword();
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { password: await bcrypt.hash(newPassword, 10) },
    });
    await this.mail.sendNewPasswordEmail(user.email, user.name, newPassword);
  }

  async getMe(userId: string) {
    const user = await this.prisma.adminUser.findUniqueOrThrow({ where: { id: userId } });
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }

  // Changing email/password both require the current password, same as any
  // account-security form — prevents a hijacked session from locking the
  // real owner out by silently swapping the login email.
  async updateAccount(userId: string, dto: UpdateAccountDto) {
    if (!dto.newEmail && !dto.newPassword) {
      throw new BadRequestException('Provide a new email or a new password to update');
    }

    const user = await this.prisma.adminUser.findUniqueOrThrow({ where: { id: userId } });
    const valid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!valid) throw new UnauthorizedException('Current password is incorrect');

    if (dto.newEmail && dto.newEmail !== user.email) {
      const existing = await this.prisma.adminUser.findUnique({ where: { email: dto.newEmail } });
      if (existing) throw new ConflictException('That email is already in use');
    }

    const updated = await this.prisma.adminUser.update({
      where: { id: userId },
      data: {
        email: dto.newEmail ?? user.email,
        password: dto.newPassword ? await bcrypt.hash(dto.newPassword, 10) : user.password,
      },
    });

    return { id: updated.id, name: updated.name, email: updated.email, role: updated.role };
  }
}
