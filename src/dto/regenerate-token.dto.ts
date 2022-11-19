import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export abstract class RegenerateTokenDTO {
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
