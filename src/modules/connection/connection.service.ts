import { CONFIG } from "@config";
import { CreateConnectionDTO } from "@dto/create-connection.dto";
import { ConnectionModel } from "@models/connection.model";
import { HttpService } from "@nestjs/axios";
import {
	ConflictException,
	HttpStatus,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { ConnectionType, SHARED } from "@shared";
import { AxiosResponse } from "axios";

@Injectable()
export class ConnectionService {
	constructor(
		@InjectModel(ConnectionModel)
		private readonly connectionModel: typeof ConnectionModel,
		private readonly httpService: HttpService,
	) {}

	public async createYouTubeConnection(
		{ code }: CreateConnectionDTO,
		{ id }: UnifiedChat.APIUser,
	): Promise<UnifiedChat.APIRes<string>> {
		const conflicted = await this.connectionModel.findOne({
			where: {
				user: id,
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

		const response: AxiosResponse = await this.httpService
			.post("https://oauth2.googleapis.com/token", data)
			.toPromise()
			.catch((err) => {
				throw new InternalServerErrorException(err.response.data.error);
			});

		const youTubeInfo = await this.getYouTubeChannel(
			response.data.access_token,
		);

		if (!youTubeInfo?.data?.items?.length)
			throw new NotFoundException("Channel not found");

		const channel = youTubeInfo.data.items[0];

		const model = await this.connectionModel.create({
			id: SHARED.Snowflake.generate(),
			user: id,
			platform: ConnectionType.YOUTUBE,
			display_name: channel.snippet.title,
			medium_thumbnail: channel.snippet.thumbnails.medium.url,
			published_at: channel.snippet.publishedAt,
			expires_in: response.data.expires_in,
			access_token: response.data.access_token,
		});

		return {
			statusCode: HttpStatus.CREATED,
			message: "Connection created.",
			data: model.access_token,
		};
	}

	private async getYouTubeChannel(access_token: string) {
		const data = {
			part: "snippet,contentDetails,statistics",
			access_token: access_token,
			mine: true,
		};

		const response: AxiosResponse = await this.httpService
			.get(CONFIG.API_URLS.youtube + "channels", {
				params: data,
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			})
			// TODO: deprecated, find another way to fetch data
			.toPromise()
			.catch((err) => {
				console.log(err);
				throw new InternalServerErrorException(err.response.data.error);
			});

		return response;
	}
}
