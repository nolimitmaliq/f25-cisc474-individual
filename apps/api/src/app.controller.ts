import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { Users } from '@repo/database';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly usersService: UsersService
  ) {}
  
  @Get('users')
  findAllUsers(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
