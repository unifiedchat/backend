import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      status: 'success',
      data: null,
    };
  }
}
