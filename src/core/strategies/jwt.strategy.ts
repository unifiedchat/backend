import { Injectable } from '@nestjs/common';
import { SessionService } from '@modules/session/session.service';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import CONFIG from '@config';
import { User } from '@modules/user/etc/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly sessionService: SessionService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: CONFIG.SECRET,
      ignoreExpiration: false,
      passReqToCallback: false,
    });
  }

  // noinspection JSUnusedGlobalSymbols
  public validate(payload): Promise<User> {
    return this.sessionService.verify(payload);
  }
}
