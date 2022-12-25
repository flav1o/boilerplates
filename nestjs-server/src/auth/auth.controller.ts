import { AuthService } from './auth.service';
import { SkipThrottle } from '@nestjs/throttler';
import { User } from 'src/graphql/graphql-schema';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public } from 'src/common/guards/public.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signUp(@Body() userCreation: AuthCredentialsDto) {
    return this.authService.signUp(userCreation);
  }

  @Public()
  @Get('signin')
  async signIn(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentials);
  }

  @Public()
  @Post('confirm-account')
  async confirmAccount(
    @Body() body: { token: string; email: string },
  ): Promise<{ accessToken }> {
    const { email, token } = body;
    return await this.authService.confirmAccount(email, token);
  }

  @Public()
  @SkipThrottle()
  @Get('signin-google')
  async signInGoogle(@Body() body: GoogleAuthDto): Promise<{ accessToken }> {
    return await this.authService.signInGoogle(body.code);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUser(@CurrentUser() user: User): User {
    return user;
  }
}
