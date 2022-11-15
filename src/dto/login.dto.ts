import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, Length } from "class-validator";

export abstract class LoginDTO {
	@ApiProperty()
	@Length(3, 32)
	@IsAlphanumeric()
	username: string;

	@ApiProperty()
	@Length(8, 32)
	password: string;
}
