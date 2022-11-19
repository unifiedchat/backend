import { UserModel } from "@models/user.model";
import { AuthController } from "@modules/auth/auth.controller";
import { AuthService } from "@modules/auth/auth.service";
import { UsersService } from "@modules/users/users.service";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SequelizeModule } from "@nestjs/sequelize";

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
	providers: [AuthService, UsersService],
	exports: [AuthService, SequelizeModule],
})
export class AuthModule {}
