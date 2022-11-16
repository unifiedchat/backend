import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "@guards/auth.guard";
import { Flags } from "@decorators/flags.decorator";
import { ConnectionService } from "@modules/connection/connection.service";
import { User } from "@decorators/user.decorator";
import { CreateConnectionDto } from "@dto/create-connection.dto";

@Controller("connection")
@ApiTags("Connection")
export class ConnectionController {
	constructor(private readonly connection: ConnectionService) {}

	@Flags("user")
	@Post("youtube")
	@UseGuards(AuthGuard)
	public async createConnectionForYoutube(
		@Body() dto: CreateConnectionDto,
		@User() user: UnifiedChat.APIUser,
	) {
		const { code } = dto;
		return this.connection.createConnectionForYoutube(code, user);
	}
}
