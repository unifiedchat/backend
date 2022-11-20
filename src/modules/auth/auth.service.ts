import { LoginDTO } from "@dto/login.dto";
import { PatchPasswordDTO } from "@dto/patch-password.dto";
import { RegenerateTokenDTO } from "@dto/regenerate-token.dto";
import { SignupDTO } from "@dto/signup.dto";
import { UserModel } from "@models/user.model";
import { UsersService } from "@modules/users/users.service";
import {
	BadRequestException,
	ConflictException,
	HttpStatus,
	Injectable,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { set } from "@utils/redis";
import * as argon2 from "argon2";

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		@InjectModel(UserModel)
		private readonly userModel: typeof UserModel,
	) {}

	public async signup(
		signupDTO: SignupDTO,
	): Promise<UnifiedChat.APIRes<UnifiedChat.APIUser>> {
		const apiUser = await this.usersService.createUser(signupDTO);

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
			include: ["id", "permissions", "access_token"],
		});
		if (!user) throw new ConflictException("User not found");

		const isValid = await argon2.verify(user.password, password);
		if (!isValid) throw new ConflictException("Invalid password");

		const apiUser = {
			id: user.id,
			permissions: user.permissions,
			access_token: user.access_token,
		};

		set<UnifiedChat.APIUser>(
			`${UnifiedChat.RedisPrefix.USERS}/${user.id}`,
			apiUser,
		);

		return apiUser;
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
		const user = await this.usersService.findDetailedUserByID(id);

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
		const user = await this.usersService.findDetailedUserByID(id);

		const isValid = await argon2.verify(user.password, password);
		if (!isValid) throw new ConflictException("Invalid password");

		const access_token = this.usersService.generateToken({
			id: user.id,
			permissions: user.permissions,
		});

		user.access_token = access_token;
		await user.save();

		const apiUser = {
			id: user.id,
			permissions: user.permissions,
			access_token,
		};

		set<UnifiedChat.APIUser>(
			`${UnifiedChat.RedisPrefix.USERS}/${user.id}`,
			apiUser,
		);

		return {
			statusCode: HttpStatus.OK,
			message: "Token regenerated",
			data: apiUser,
		};
	}
}
