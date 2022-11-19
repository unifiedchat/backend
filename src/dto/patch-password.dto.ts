import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export abstract class PatchPasswordDTO {
	@ApiProperty({
		title: "Old Password",
		description: "Account old password",
		nullable: false,
		required: true,
		minimum: 8,
		maximum: 32,
	})
	@Length(8, 32)
	old_password: string;

	@ApiProperty({
		title: "Old Password R",
		description: "Account old password repeated",
		nullable: false,
		required: true,
		minimum: 8,
		maximum: 32,
	})
	@Length(8, 32)
	old_password_again: string;

	@ApiProperty({
		title: "New Password",
		description: "Account new password",
		nullable: false,
		required: true,
		minimum: 8,
		maximum: 32,
	})
	@Length(8, 32)
	new_password: string;

	@ApiProperty({
		title: "New Password R",
		description: "Account new password repeated",
		nullable: false,
		required: true,
		minimum: 8,
		maximum: 32,
	})
	@Length(8, 32)
	new_password_again: string;
}
