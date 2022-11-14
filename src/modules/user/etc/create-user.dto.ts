import { IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  @Length(4, 20)
  username: string;

  @ApiProperty()
  @IsString()
  @Length(8, 70)
  password: string;
}
