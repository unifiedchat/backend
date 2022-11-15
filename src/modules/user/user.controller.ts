import { Flags } from "@decorators/flags.decorator";
import { User } from "@decorators/user.decorator";
import { AuthGuard } from "@guards/auth.guard";
import { Controller, Get, HttpStatus, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

@Controller("user")
@ApiTags("User")
export class UserController {
	@Flags("user")
	@Get()
	@UseGuards(AuthGuard)
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
