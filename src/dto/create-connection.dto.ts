import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateConnectionDTO {
	@ApiProperty({
		title: "Connection Code",
		description: "The code of the connection",
		nullable: false,
		required: true,
	})
	@IsString()
	@IsNotEmpty()
	public readonly code: string;
}
