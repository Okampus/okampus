import { InjectRepository } from '@mikro-orm/nestjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { firstValueFrom } from 'rxjs';
import { config } from '../config';
import { BaseRepository } from '../shared/lib/repositories/base.repository';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class MyEfreiStrategy extends PassportStrategy(Strategy, 'myefrei') {
  constructor(
    @InjectRepository(User) private readonly userRepository: BaseRepository<User>,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
  ) {
    super({
      authorizationURL: config.get('myefreiOauthAuthorizeUrl'),
      tokenURL: config.get('myefreiOauthTokenUrl'),
      clientID: config.get('myefreiOauthClientId'),
      clientSecret: config.get('myefreiOauthClientSecret'),
      callbackURL: 'https://api.horizon-efrei.fr/auth/myefrei/callback',
    });
  }

  public async validate(accessToken: string): Promise<User> {
    const result = this.httpService.get(config.get('myefreiOauthUserUrl'), {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const { data } = await firstValueFrom(result);
    console.log('DEBUG: returned user:', data);

    const user = await this.userRepository.findOne({ userId: data.username });
    if (user)
      return user;

    return await this.userService.create({
      email: data.email,
      username: data.username,
      firstname: data.firstname,
      lastname: data.name,
      fullname: data.fullName,
    });
  }
}
