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
import { WsException } from "@nestjs/websockets";

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
		const socketConnection = ctx.switchToWs().getClient();

		let token: string =
			(req.headers && req.headers["x-access-token"]) ||
			(req.headers && req.headers["authorization"]) ||
			(req.query && req.query["access_token"]) ||
			(req.handshake && req.handshake.auth.token);

		if (!token) {
			if (socketConnection) {
				throw new WsException("Access token expected.");
			}

			throw new UnauthorizedException("Access token expected.");
		}
		token = token.startsWith("Bearer")
			? token.match(/[^Bearer]\S+/g)[0].trim()
			: token;

		const tokenUser = this.jwt.decode(token) as UnifiedChat.APIUser;
		if (!tokenUser) {
			if (socketConnection) {
				throw new WsException("Invalid access token.");
			}

			throw new UnauthorizedException("Invalid access token.");
		}

		const apiUser = await this.usersService.findUserByID(tokenUser.id);

		if (!SHARED.Permissions.has(apiUser.permissions, flags)) {
			if (socketConnection) {
				throw new WsException("Insufficient permissions.");
			}

			throw new UnauthorizedException("Insufficient permissions.");
		}

		req.user = apiUser;

		return true;
	}
}
