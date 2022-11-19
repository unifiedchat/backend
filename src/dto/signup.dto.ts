import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, Length } from "class-validator";

export abstract class SignupDTO {
	@ApiProperty({
		title: "Username",
		description: "Account username to signup",
		nullable: false,
		required: true,
		minimum: 3,
		maximum: 32,
	})
	@Length(3, 32)
	@IsAlphanumeric()
	public username: string;

	@ApiProperty({
		title: "E-Mail",
		description: "Account email",
		nullable: false,
		required: true,
		example: "chat@338.rocks",
	})
	@IsEmail()
	public mail: string;

	@ApiProperty({
		title: "Password",
		description: "Account password",
		nullable: false,
		required: true,
		minimum: 8,
		maximum: 32,
	})
	@Length(8, 32)
	public password: string;
}
