import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @Length(4, 20)
  username: string;
}
