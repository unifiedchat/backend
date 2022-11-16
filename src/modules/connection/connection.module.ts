import { Module } from "@nestjs/common";
import { ConnectionService } from "./connection.service";
import { ConnectionController } from "@modules/connection/connection.controller";
import { UserService } from "@modules/user/user.service";
import { SequelizeModule } from "@nestjs/sequelize";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthModule } from "@modules/auth/auth.module";
import { HttpModule } from "@nestjs/axios";
import { ConnectionModel } from "@models/connection.model";

@Module({
	imports: [
		SequelizeModule.forFeature([ConnectionModel]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				secret: config.get("SECRET"),
			}),
			inject: [ConfigService],
		}),
		AuthModule,
		HttpModule,
	],
	controllers: [ConnectionController],
	providers: [ConnectionService, UserService],
	exports: [ConnectionService, SequelizeModule, JwtModule],
})
export class ConnectionModule {}
