import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsString()
  @Length(8, 70)
  password: string;
}
