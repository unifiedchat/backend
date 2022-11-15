import { ApiProperty } from "@nestjs/swagger";
import { IsAlphanumeric, IsEmail, Length } from "class-validator";

export abstract class SignupDTO {
	@ApiProperty()
	@Length(3, 32)
	@IsAlphanumeric()
	public username: string;

	@ApiProperty()
	@IsEmail()
	public mail: string;

	@ApiProperty()
	@Length(8, 32)
	public password: string;
}
