import { HttpStatus } from "@nestjs/common";

export {};

declare global {
	namespace UnifiedChat {
		interface APIRes<T> {
			statusCode: HttpStatus;
			message: string;
			data: T;
		}

		interface APIUser {
			id: string;
			permissions: number;
			access_token: string;
		}

		enum ConnectionType {
			YOUTUBE,
		}
	}
}
