import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { SHARED } from "@shared";

abstract class User {
	@ApiProperty({
		description: "User ID",
	})
	id: string;

	@ApiProperty({
		description: "User permissions",
		default: SHARED.Permissions.get("user"),
		example: SHARED.Permissions.get("user"),
	})
	permissions: number;

	@ApiProperty({
		description: "User access token",
	})
	access_token: string;
}

export abstract class UserEntity {
	@ApiProperty({
		example: HttpStatus.OK,
		description: "Status code",
	})
	statusCode: HttpStatus;

	@ApiProperty({
		description: "Response message",
	})
	message: string;

	@ApiProperty({
		description: "User data",
	})
	data: User;
}
