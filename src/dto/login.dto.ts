import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, Length } from "class-validator";

export abstract class LoginDTO {
	@ApiProperty({
		title: "Username",
		description: "Account username to login",
		nullable: false,
		required: true,
		minimum: 3,
		maximum: 32,
	})
	@Length(3, 32)
	@IsAlphanumeric()
	username: string;

	@ApiProperty({
		title: "Password",
		description: "Account password",
		nullable: false,
		required: true,
		minimum: 8,
		maximum: 32,
	})
	@Length(8, 32)
	password: string;
}
