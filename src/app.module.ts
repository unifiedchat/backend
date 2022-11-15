import { factory } from "@config";
import { AuthModule } from "@modules/auth/auth.module";
import { HealthModule } from "@modules/health/health.module";
import { UserModule } from "@modules/user/user.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { SequelizeModule } from "@nestjs/sequelize";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { AppController } from "./app.controller";

@Module({
	imports: [
		ThrottlerModule.forRoot({
			ttl: 60,
			limit: 10,
		}),
		ConfigModule.forRoot({
			isGlobal: true,
			load: [factory],
		}),
		SequelizeModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (config: ConfigService) => ({
				dialect: "postgres",
				autoLoadModels: true,
				synchronize: true,
				host: config.get("POSTGRES.host"),
				port: config.get("POSTGRES.port"),
				username: config.get("POSTGRES.username"),
				password: config.get("POSTGRES.password"),
				database: config.get("POSTGRES.database"),
			}),
			inject: [ConfigService],
		}),
		HealthModule,
		AuthModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class AppModule {}
