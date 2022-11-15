import { LoginDTO } from "@dto/login.dto";
import { PatchPasswordDTO } from "@dto/patch-password.dto";
import { RegenerateTokenDTO } from "@dto/regenerate-token.dto";
import { SignupDTO } from "@dto/signup.dto";
import { UserModel } from "@models/user.model";
import { UserService } from "@modules/user/user.service";
import {
	BadRequestException,
	ConflictException,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
	constructor(
		private readonly userService: UserService,
		@InjectModel(UserModel)
		private readonly userModel: typeof UserModel,
		private readonly jwt: JwtService,
	) {}

	public async signup(
		signupDTO: SignupDTO,
	): Promise<UnifiedChat.APIRes<UnifiedChat.APIUser>> {
		const apiUser = await this.userService.createUser(signupDTO);

		return {
			statusCode: HttpStatus.CREATED,
			message: "Signed up!",
			data: apiUser,
		};
	}

	public async authenticateUser({
		username,
		password,
	}: LoginDTO): Promise<UnifiedChat.APIUser> {
		const user = await this.userModel.findOne({
			where: {
				username,
			},
		});
		if (!user) throw new ConflictException("User not found");

		const isValid = await argon2.verify(user.password, password);
		if (!isValid) throw new ConflictException("Invalid password");

		return {
			id: user.id,
			permissions: user.permissions,
			access_token: user.access_token,
		};
	}

	public async patchPassword(
		{ id }: UnifiedChat.APIUser,
		{
			new_password,
			new_password_again,
			old_password,
			old_password_again,
		}: PatchPasswordDTO,
	): Promise<UnifiedChat.APIRes<boolean>> {
		const user = await this.userService.findDetailedUserByID(id);

		const isValid = await argon2.verify(user.password, old_password);
		if (!isValid) throw new ConflictException("Invalid password");

		if (new_password !== new_password_again)
			throw new BadRequestException("New passwords don't match");
		if (old_password !== old_password_again)
			throw new BadRequestException("Old passwords don't match");

		const hashedPassword = await argon2.hash(new_password);
		await this.userModel.update(
			{
				password: hashedPassword,
			},
			{
				where: {
					id,
				},
			},
		);

		return {
			statusCode: HttpStatus.OK,
			message: "Password changed!",
			data: true,
		};
	}

	public async regenerateToken(
		{ id }: UnifiedChat.APIUser,
		{ password }: RegenerateTokenDTO,
	): Promise<UnifiedChat.APIRes<UnifiedChat.APIUser>> {
		const user = await this.userService.findDetailedUserByID(id);

		const isValid = await argon2.verify(user.password, password);
		if (!isValid) throw new ConflictException("Invalid password");

		const access_token = this.userService.generateToken({
			id: user.id,
			permissions: user.permissions,
		});

		user.access_token = access_token;
		await user.save();

		return {
			statusCode: HttpStatus.OK,
			message: "Token regenerated",
			data: {
				id: user.id,
				permissions: user.permissions,
				access_token,
			},
		};
	}
}
