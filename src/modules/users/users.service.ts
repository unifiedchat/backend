import { SignupDTO } from "@dto/signup.dto";
import { UserModel } from "@models/user.model";
import { ConflictException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectModel } from "@nestjs/sequelize";
import { SHARED } from "@shared";
import { get, set } from "@utils/redis";
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

	public async findUserByID(id: string): Promise<UnifiedChat.APIUser> {
		let cachedUser = await get<UnifiedChat.APIUser>(
			`${UnifiedChat.RedisPrefix.USERS}/${id}`,
		);
		if (!cachedUser) {
			const user = await this.userModel.findOne({
				where: {
					id,
				},
				include: ["id", "permissions", "access_token"],
			});

			if (!user) throw new ConflictException("User not found");

			const apiUser = {
				id,
				permissions: user.permissions,
				access_token: user.access_token,
			};

			cachedUser = apiUser;

			set<UnifiedChat.APIUser>(
				`${UnifiedChat.RedisPrefix.USERS}/${id}`,
				apiUser,
			);
		}

		return cachedUser;
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
			include: ["id"],
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

		const apiUser = {
			id,
			permissions: user.permissions,
			access_token,
		};

		set<UnifiedChat.APIUser>(
			`${UnifiedChat.RedisPrefix.USERS}/${id}`,
			apiUser,
		);

		return apiUser;
	}
}
