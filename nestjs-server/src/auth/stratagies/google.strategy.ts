import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { OAuth2Client, TokenPayload } from 'google-auth-library';

@Injectable()
export class GoogleStrategy {
  private oauthClient: OAuth2Client;

  constructor(private readonly userService: UsersService) {
    this.oauthClient = new OAuth2Client('');
  }

  async validate(token: string): Promise<any> {
    const ticket = await this.oauthClient.verifyIdToken({
      idToken: token,
      audience: '',
    });

    const payload: TokenPayload = ticket.getPayload();

    const user = await this.userService.findUserByEmail(payload.email);

    if (!user) await this.userService.createUserExternalAuth(payload.email);

    return payload;
  }
}
