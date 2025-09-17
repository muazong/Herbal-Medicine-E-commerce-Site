import {
  Res,
  Req,
  Get,
  Post,
  Body,
  Controller,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import {
  JwtAuthGuard,
  LocalAuthGuard,
  GithubAuthGuard,
  GoogleAuthGuard,
} from './guards';
import { env } from '../../common/config';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getUserInfo(@Req() req: any) {
    return this.authService.getUserInfo(req.user);
  }

  @Get('refresh')
  refreshAccessToken(@Req() req: Request) {
    const token = req.cookies[env.refreshTokenName];
    return this.authService.refreshAccessToken(token);
  }

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Get('google/login')
  @UseGuards(GoogleAuthGuard)
  async googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user as User, res);
  }

  @Get('github/login')
  @UseGuards(GithubAuthGuard)
  async githubLogin() {}

  @Get('github/callback')
  @UseGuards(GithubAuthGuard)
  async githubLoginCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.login(req.user as User, res);
  }

  // WARN: For test only
  // https://github.com/logout
  // https://google.com/accounts/Logout

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    return this.authService.logout(res);
  }
}
