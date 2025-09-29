import {
    Controller,
      Get,
        Post,
          Body,
            Patch,
              Param,
                Delete,
                } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users,Role } from '@repo/database';
interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  lastname?: string;
  bio?: string;
  role?: Role;
}

interface UpdateUserDto {
  email: string;
  password: string;
  name?: string;
  lastname?: string;
  bio?: string;
  role?: Role;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

   @Post()
    addNewUser(@Body() createUserDto: CreateUserDto) {
      return this.usersService.create(createUserDto);
    }
  
  @Get()
  findAll(): Promise<Users[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Users> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  // we include the body of the request to get the updated user data
  // @param id the URL parameter to extract for example /users/1 -> id = 1
  updateUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto): Promise<Users> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  removeUser(@Param('id') id: string): Promise<Users> {
    return this.usersService.remove(id);
  }
}