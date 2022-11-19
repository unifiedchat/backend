import { ConnectionModel } from "@models/connection.model";
import { AuthModule } from "@modules/auth/auth.module";
import { ConnectionController } from "@modules/connection/connection.controller";
import { UsersService } from "@modules/users/users.service";
import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { ConnectionService } from "./connection.service";

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
	providers: [ConnectionService, UsersService],
	exports: [ConnectionService, SequelizeModule, JwtModule],
})
export class ConnectionModule {}
