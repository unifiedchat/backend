import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export abstract class BoolEntity {
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
		example: true,
		description: "Response",
	})
	data: boolean;
}
