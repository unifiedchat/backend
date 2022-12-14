import { Flags } from "@decorators/flags.decorator";
import { User } from "@decorators/user.decorator";
import { LoginDTO } from "@dto/login.dto";
import { PatchPasswordDTO } from "@dto/patch-password.dto";
import { RegenerateTokenDTO } from "@dto/regenerate-token.dto";
import { SignupDTO } from "@dto/signup.dto";
import { BoolEntity } from "@entities/bool.entity";
import { UserEntity } from "@entities/user.entity";
import { AuthGuard } from "@guards/auth.guard";
import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { ApiResponse, ApiTags } from "@nestjs/swagger";
import { AuthService } from "./auth.service";

@Controller("auth")
@ApiTags("Authentication")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Flags("user")
	@Patch("password")
	@UseGuards(AuthGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Change password",
		type: BoolEntity,
		headers: {
			Authorization: {
				description: "Authorization token",
				required: true,
			},
		},
	})
	public changePassword(
		@User() user: UnifiedChat.APIUser,
		@Body() patchPasswordDTO: PatchPasswordDTO,
	): Promise<UnifiedChat.APIRes<boolean>> {
		return this.authService.patchPassword(user, patchPasswordDTO);
	}

	@Flags("user")
	@Patch("token")
	@UseGuards(AuthGuard)
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Change authorization token",
		type: UserEntity,
		headers: {
			Authorization: {
				description: "Authorization token",
				required: true,
			},
		},
	})
	public regenerateToken(
		@User() user: UnifiedChat.APIUser,
		@Body() regenerateTokenDTO: RegenerateTokenDTO,
	): Promise<UnifiedChat.APIRes<UnifiedChat.APIUser>> {
		return this.authService.regenerateToken(user, regenerateTokenDTO);
	}

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

	@Post("signup")
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Create user",
		type: UserEntity,
	})
	public async signup(
		@Body() signupDTO: SignupDTO,
	): Promise<UnifiedChat.APIRes<UnifiedChat.APIUser>> {
		return this.authService.signup(signupDTO);
	}

	@Post("login")
	@ApiResponse({
		status: HttpStatus.OK,
		description: "Login to account",
		type: UserEntity,
	})
	async signin(
		@Body() loginDTO: LoginDTO,
	): Promise<UnifiedChat.APIRes<UnifiedChat.APIUser>> {
		const user = await this.authService.authenticateUser(loginDTO);

		return {
			statusCode: HttpStatus.OK,
			message: "Logged in",
			data: user,
		};
	}
}
