import { UsersService } from "@modules/users/users.service";
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { SHARED } from "@shared";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private readonly usersService: UsersService,
		private readonly reflector: Reflector,
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

		const user = await this.usersService.findUserByToken(token);
		if (!SHARED.Permissions.has(user.permissions, flags))
			throw new UnauthorizedException("Insufficient permissions.");

		req.user = user;

		return true;
	}
}
