import { AuthService } from './auth.service';
import { GoogleAuthDto } from './dto/google-auth.dto';
import { Public } from 'src/common/guards/public.guard';
import { Role, User } from 'src/graphql/graphql-schema';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/get-current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() userCreation: AuthCredentialsDto) {
    return this.authService.signUp(userCreation);
  }

  @Get('signin')
  async signIn(
    @Body() authCredentials: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.signIn(authCredentials);
  }

  @Post('confirm-account')
  async confirmAccount(
    @Body() body: { token: string; email: string },
  ): Promise<{ accessToken }> {
    const { email, token } = body;
    return await this.authService.confirmAccount(email, token);
  }

  @Get('signin-google')
  async signInGoogle(@Body() body: GoogleAuthDto): Promise<{ accessToken }> {
    return await this.authService.signInGoogle(body.code);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  getUser(@CurrentUser() user: User): User {
    return user;
  }

  @Roles([Role.ADMIN])
  @Public()
  @Get('role-guard')
  test() {
    return 123;
  }
}
