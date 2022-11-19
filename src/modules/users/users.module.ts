import { UserModel } from "@models/user.model";
import { AuthModule } from "@modules/auth/auth.module";
import { UsersController } from "@modules/users/users.controller";
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
		AuthModule,
	],
	controllers: [UsersController],
	providers: [UsersService],
	exports: [SequelizeModule, UsersService, JwtModule],
})
export class UsersModule {}
