import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";
import { UserModel } from "@models/user.model";
import { UserService } from "@modules/user/user.service";
import { AuthController } from "@modules/auth/auth.controller";
import { AuthService } from "@modules/auth/auth.service";

@Module({
	imports: [
		SequelizeModule.forFeature([UserModel]),
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: async (config: ConfigService) => ({
				secret: config.get("SECRET"),
			}),
			inject: [ConfigService],
		}),
	],
	controllers: [AuthController],
	providers: [AuthService, UserService],
	exports: [AuthService, SequelizeModule],
})
export class AuthModule {}
