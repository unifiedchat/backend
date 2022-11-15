import { UserModel } from "@models/user.model";
import { AuthModule } from "@modules/auth/auth.module";
import { UserController } from "@modules/user/user.controller";
import { UserService } from "@modules/user/user.service";
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
		AuthModule,
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [SequelizeModule, UserService, JwtModule],
})
export class UserModule {}
