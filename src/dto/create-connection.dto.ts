import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateConnectionDto {
	@ApiProperty()
	@IsString()
	public readonly code: string;
}
