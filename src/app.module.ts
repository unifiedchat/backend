import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserModule } from '@modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import CONFIG from './config';
import { SessionModule } from '@modules/session/session.module';

@Module({
  imports: [MongooseModule.forRoot(CONFIG.MONGO_URL), UserModule, SessionModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
