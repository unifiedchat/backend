import { CONFIG } from "@config";
import helmet from "@fastify/helmet";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import {
	FastifyAdapter,
	NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as morgan from "morgan";
import { AppModule } from "./app.module";

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	);

	app.getHttpAdapter()
		.getInstance()
		.register(morgan("dev"))
		.register(helmet, {
			contentSecurityPolicy: {
				directives: {
					defaultSrc: [`'self'`],
					styleSrc: [`'self'`, `'unsafe-inline'`],
					imgSrc: [`'self'`, "data:", "validator.swagger.io"],
					scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
				},
			},
		});

	app.enableCors();

	app.setGlobalPrefix(CONFIG.API_VERSION);
	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
		}),
	);

	const config = new DocumentBuilder()
		.setTitle("Unified Chat API Docs")
		.setDescription("Unified Chat endpoints")
		.setVersion("1.0")
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config, {
		deepScanRoutes: true,
	});
	SwaggerModule.setup("api", app, document, {
		explorer: true,
	});

	console.log(CONFIG.PORT);

	await app.listen(CONFIG.PORT, "0.0.0.0");
}

bootstrap();
