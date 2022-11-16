import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { InjectModel } from "@nestjs/sequelize";
import { ConnectionModel } from "@models/connection.model";
import { CONFIG } from "@config";

enum ConnectionType {
	YOUTUBE = "youtube",
}

@Injectable()
export class ConnectionService {
	constructor(
		@InjectModel(ConnectionModel)
		private readonly connectionModel: typeof ConnectionModel,
		private readonly httpService: HttpService,
	) {}

	public async createConnectionForYoutube(
		code: string,
		user: UnifiedChat.APIUser,
	): Promise<UnifiedChat.APIRes<any>> {
		const conflicted = await this.connectionModel.findOne({
			where: {
				user: user.id,
				platform: ConnectionType.YOUTUBE,
			},
		});

		if (conflicted)
			throw new ConflictException("Connection already exists");

		const data = {
			code,
			client_id: CONFIG.GOOGLE.clientID,
			client_secret: CONFIG.GOOGLE.clientSecret,
			redirect_uri: CONFIG.GOOGLE.redirectURI,
			grant_type: "authorization_code",
		};

		const response: any = await this.httpService
			.post("https://oauth2.googleapis.com/token", data)
			.toPromise()
			.catch((err) => {
				throw new InternalServerErrorException(err.response.data.error);
			});

		const channel = await this.getMyChannelOfYoutube(
			response.data.access_token,
		);

		if (!channel.data.items[0])
			throw new NotFoundException("Channel not found");

		const model = await this.connectionModel.create({
			user: user.id,
			platform: ConnectionType.YOUTUBE,
			display_name: channel.data.items[0].snippet.title,
			medium_thumbnail:
				channel.data.items[0].snippet.thumbnails.medium.url,
			published_at: channel.data.items[0].snippet.publishedAt,
			expires_in: response.data.expires_in,
			access_token: response.data.access_token,
		});

		return {
			statusCode: 200,
			message: "Connection created.",
			data: model.access_token,
		};
	}

	private async getMyChannelOfYoutube(access_token: string) {
		const data = {
			part: "snippet,contentDetails,statistics",
			access_token: access_token,
			mine: true,
		};

		const response: any = await this.httpService
			.get(CONFIG.API_URLS.youtube + "channels", {
				params: data,
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			})
			.toPromise()
			.catch((err) => {
				console.log(err);
				throw new InternalServerErrorException(err.response.data.error);
			});

		return response;
	}
}
