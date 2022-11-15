import { ApiProperty } from "@nestjs/swagger";
import { Length } from "class-validator";

export abstract class RegenerateTokenDTO {
	@ApiProperty()
	@Length(8, 32)
	password: string;
}
