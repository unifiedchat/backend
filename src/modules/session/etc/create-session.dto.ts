import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty()
  @IsString()
  @Length(4, 20)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(8, 70)
  password: string;
}
