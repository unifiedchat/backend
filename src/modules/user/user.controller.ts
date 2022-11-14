import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { Throttle } from '@nestjs/throttler';
import { CreateUserDto } from './etc/create-user.dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Throttle(1, 60 * 8)
  @Post()
  async create(@Body() createDTO: CreateUserDto) {
    return await this.userService.create(createDTO);
  }
}
