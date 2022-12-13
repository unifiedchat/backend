import {
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from "@nestjs/common";
import { AxiosResponse } from "axios";
import { CONFIG } from "@config";
import { InjectModel } from "@nestjs/sequelize";
import { ConnectionModel } from "@models/connection.model";
import { ConnectionType } from "@shared";
import { HttpService } from "@nestjs/axios";
import { WsException } from "@nestjs/websockets";
import { from, map } from "rxjs";

@Injectable()
export class ChatService {
	constructor(
		@InjectModel(ConnectionModel)
		private readonly connectionModel: typeof ConnectionModel,
		private readonly httpService: HttpService,
	) {}

	public async getMessages(channelId: string) {
		const connection = await this.connectionModel.findOne({
			where: {
				platform: ConnectionType.YOUTUBE,
			},
		});

		if (!connection) throw new WsException("Connection not found");

		const chatId = await this.getLiveChatId(channelId);
		if (!chatId.items.length)
			throw new WsException("Live stream not found");

		const liveChatId =
			chatId.items[0].liveStreamingDetails.activeLiveChatId;

		if (!liveChatId) throw new WsException("Live chat not found");

		const data = {
			part: "snippet,authorDetails",
			liveChatId,
		};

		const response: AxiosResponse = await this.httpService
			.get(CONFIG.API_URLS.youtube + "liveChat/messages", {
				params: data,
				headers: {
					Authorization: `Bearer ${connection.access_token}`,
				},
			})
			.toPromise()
			.catch((err) => {
				console.log(err);
				throw new WsException(err.response.data.error);
			});

		const formattedMessages = response.data.items.map((message) => {
			return this.formatMessage(message);
		});

		const event = "messages";

		return from(formattedMessages).pipe(map((data) => ({ event, data })));
	}

	public async getLiveChatId(channelId: string) {
		if (!channelId) throw new NotFoundException("Channel not found");

		const connection = await this.connectionModel.findOne({
			where: {
				platform: ConnectionType.YOUTUBE,
			},
		});

		if (!connection) throw new WsException("Connection not found");

		const data = {
			part: "liveStreamingDetails,snippet",
			id: channelId,
		};

		const response: AxiosResponse = await this.httpService
			.get(CONFIG.API_URLS.youtube + "videos", {
				params: data,
				headers: {
					Authorization: `Bearer ${connection.access_token}`,
				},
			})
			.toPromise()
			.catch((err) => {
				throw new WsException(err.response.data.error);
			});

		return response.data;
	}

	private formatMessage(message: any) {
		const formattedMessage = {
			id: message.id,
			channelId: message.snippet.authorChannelId,
			channelName: message.authorDetails.displayName,
			message: message.snippet.displayMessage,
			profilePicture: message.authorDetails.profileImageUrl,
			verified: message.authorDetails.isVerified,
			chatOwner: message.authorDetails.isChatOwner,
			chatModerator: message.authorDetails.isChatModerator,
			publishedAt: message.snippet.publishedAt,
		};

		return formattedMessage;
	}
}
