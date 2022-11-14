import { Module } from '@nestjs/common';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '@modules/user/user.module';
import { JwtStrategy } from '@strategies/jwt.strategy';
import CONFIG from '@config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: CONFIG.SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
    UserModule,
  ],
  controllers: [SessionController],
  providers: [SessionService, JwtStrategy],
})
export class SessionModule {}
