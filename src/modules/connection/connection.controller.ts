import { Flags } from "@decorators/flags.decorator";
import { User } from "@decorators/user.decorator";
import { CreateConnectionDTO } from "@dto/create-connection.dto";
import { StringEntity } from "@entities/string.entity";
import { AuthGuard } from "@guards/auth.guard";
import { ConnectionService } from "@modules/connection/connection.service";
import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("connection")
@ApiTags("Connection")
export class ConnectionController {
	constructor(private readonly connection: ConnectionService) {}

	@Flags("user")
	@Post("youtube")
	@UseGuards(AuthGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Get personal info.",
		type: StringEntity,
		headers: {
			Authorization: {
				description: "Authorization token",
				required: true,
			},
		},
	})
	public async createYouTubeConnection(
		@Body() createConnectionDTO: CreateConnectionDTO,
		@User() user: UnifiedChat.APIUser,
	): Promise<UnifiedChat.APIRes<string>> {
		return this.connection.createYouTubeConnection(
			createConnectionDTO,
			user,
		);
	}
}
