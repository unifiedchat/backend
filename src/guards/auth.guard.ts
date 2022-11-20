import { UsersService } from "@modules/users/users.service";
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { SHARED } from "@shared";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly usersService: UsersService,
		private readonly reflector: Reflector,
		private readonly jwt: JwtService,
	) {}

	async canActivate(ctx: ExecutionContext): Promise<boolean> {
		const flags = this.reflector.get<number>("flags", ctx.getHandler());
		const req = ctx.switchToHttp().getRequest();

		let token: string =
			req.headers["x-access-token"] ||
			req.headers["authorization"] ||
			req.query["access_token"];
		if (!token) throw new UnauthorizedException("Access token expected.");
		token = token.startsWith("Bearer")
			? token.match(/[^Bearer]\S+/g)[0].trim()
			: token;

		const tokenUser = this.jwt.decode(token) as UnifiedChat.APIUser;
		if (!tokenUser)
			throw new UnauthorizedException("Invalid access token.");

		const apiUser = await this.usersService.findUserByID(tokenUser.id);

		if (!SHARED.Permissions.has(apiUser.permissions, flags))
			throw new UnauthorizedException("Insufficient permissions.");

		req.user = apiUser;

		return true;
	}
}
