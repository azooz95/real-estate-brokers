import { Body, Controller, Get, HttpCode, Post, Put, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService, private config: ConfigService, private jwt: JwtService) {}

  private setAuthCookie(res: Response, token: string) {
    res.cookie('access_token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.config.get('NODE_ENV') === 'production',
      maxAge: 8 * 60 * 60 * 1000,
    });
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const { token, user } = await this.auth.login(dto);
    this.setAuthCookie(res, token);
    return { token, user };
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
  }

  @Post('forgot')
  @HttpCode(204)
  async forgot(@Body() dto: ForgotPasswordDto) {
    await this.auth.forgotPassword(dto.email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: Request & { user: { id: string } }) {
    return this.auth.getMe(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('account')
  async updateAccount(
    @Req() req: Request & { user: { id: string } },
    @Body() dto: UpdateAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.updateAccount(req.user.id, dto);
    // Re-issue the cookie so the session reflects the new email immediately,
    // without forcing the admin to log out and back in.
    const token = await this.jwt.signAsync({ sub: user.id, email: user.email, role: user.role });
    this.setAuthCookie(res, token);
    return { user };
  }
}
