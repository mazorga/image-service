import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}
  // todo this is not final impl
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return this.authService.loginWithCredentials(req.user);
  }
}