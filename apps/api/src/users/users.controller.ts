import {
    Controller,
      Get,
        Post,
          Body,
            Patch,
              Param,
                Delete, UseGuards
                } from '@nestjs/common';
import { UsersService } from './users.service';
import { Users,Role } from '@repo/database';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtUser } from 'src/auth/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';
import {UnauthorizedException} from '@nestjs/common';
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

  @UseGuards(AuthGuard('jwt')) 
  @Get('me')                   
  async me(@CurrentUser() auth: JwtUser){
    console.log(auth);
    if (!auth || !auth.userId) {
      throw new UnauthorizedException();
    }
    const user = await this.usersService.findOne(auth.userId);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      lastname : user.lastname
    };
  }
}