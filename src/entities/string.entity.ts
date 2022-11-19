import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export abstract class StringEntity {
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
		description: "Response",
	})
	data: string;
}
