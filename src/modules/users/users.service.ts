import { LoginDTO } from "@dto/login.dto";
import { SignupDTO } from "@dto/signup.dto";
import { UserModel } from "@models/user.model";
import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { SHARED } from "@shared";
import * as argon2 from "argon2";
import { Op } from "sequelize";

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(UserModel)
		private readonly userModel: typeof UserModel,
		private readonly jwt: JwtService,
	) {}

	public generateToken(
		user: Omit<UnifiedChat.APIUser, "access_token">,
		expires: number = 30 * 24 * 60 * 60 * 1000,
	): string {
		const token = this.jwt.sign(user, {
			expiresIn: expires,
		});
		return token;
	}

	public async findUserByToken(token: string): Promise<UnifiedChat.APIUser> {
		const user = await this.userModel.findOne({
			where: {
				access_token: token,
			},
		});
		if (!user) throw new UnauthorizedException("Invalid access token");

		return {
			id: user.id,
			access_token: user.access_token,
			permissions: user.permissions,
		};
	}

	public async findUserByID(id: string): Promise<UnifiedChat.APIUser> {
		const user = await this.userModel.findOne({
			where: {
				id,
			},
		});
		if (!user) throw new ConflictException("User not found");

		return {
			id: user.id,
			permissions: user.permissions,
			access_token: user.access_token,
		};
	}

	public async findDetailedUserByID(id: string): Promise<UserModel> {
		const user = await this.userModel.findOne({
			where: {
				id,
			},
		});
		if (!user) throw new ConflictException("User not found");

		return user;
	}

	public async createUser({
		mail,
		password,
		username,
	}: SignupDTO): Promise<UnifiedChat.APIUser> {
		const conflicted = await this.userModel.findOne({
			where: {
				[Op.or]: [{ mail }, { username }],
			},
		});
		if (conflicted) throw new ConflictException("User already exists");

		const id = SHARED.Snowflake.generate();
		const access_token = this.generateToken({
			id,
			permissions: SHARED.Permissions.get("user"),
		});
		const user = await this.userModel.create({
			id,
			username,
			mail,
			password: await argon2.hash(password),
			access_token,
		});

		return {
			id,
			permissions: user.permissions,
			access_token,
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
}
