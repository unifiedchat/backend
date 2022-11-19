import { Flags } from "@decorators/flags.decorator";
import { User } from "@decorators/user.decorator";
import { UserEntity } from "@entities/user.entity";
import { AuthGuard } from "@guards/auth.guard";
import { Controller, Get, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";

@Controller("user")
@ApiTags("User")
export class UsersController {
	@Flags("user")
	@Get("@me")
	@UseGuards(AuthGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Get personal info.",
		type: UserEntity,
		headers: {
			Authorization: {
				description: "Authorization token",
				required: true,
			},
		},
	})
	public async getMe(
		@User() user: UnifiedChat.APIUser,
	): Promise<UnifiedChat.APIRes<UnifiedChat.APIUser>> {
		return {
			statusCode: HttpStatus.OK,
			message: "Get personal info.",
			data: user,
		};
	}
}
