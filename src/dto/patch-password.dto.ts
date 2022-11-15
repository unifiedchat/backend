import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export abstract class PatchPasswordDTO {
	@ApiProperty()
	@Length(8, 32)
	old_password: string;

	@ApiProperty()
	@Length(8, 32)
	old_password_again: string;

	@ApiProperty()
	@Length(8, 32)
	new_password: string;

	@ApiProperty()
	@Length(8, 32)
	new_password_again: string;
}
