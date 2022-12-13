import { Module } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ChatGateway } from "./chat.gateway";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConnectionModel } from "@models/connection.model";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { HttpModule } from "@nestjs/axios";
import { UsersService } from "@modules/users/users.service";
import { UserModel } from "@models/user.model";

@Module({
	imports: [
		SequelizeModule.forFeature([ConnectionModel, UserModel]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				secret: config.get("SECRET"),
			}),
			inject: [ConfigService],
		}),
		HttpModule,
	],
	providers: [ChatGateway, ChatService, UsersService],
})
export class ChatModule {}
