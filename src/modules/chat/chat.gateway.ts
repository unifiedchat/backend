import {
	WebSocketGateway,
	SubscribeMessage,
	MessageBody,
} from "@nestjs/websockets";
import { ChatService } from "./chat.service";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "@guards/auth.guard";

@WebSocketGateway(3002, {
	cors: true,
})
export class ChatGateway {
	constructor(private readonly chatService: ChatService) {}

	@UseGuards(AuthGuard)
	@SubscribeMessage("getMessages")
	async getMessages(@MessageBody() data: string) {
		return await this.chatService.getMessages(data);
	}
}
