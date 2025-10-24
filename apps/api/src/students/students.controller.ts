import {Controller,Get,Post,Body,Patch,Param,Delete,UsePipes,
  UseGuards,
  Req,} from '@nestjs/common';
import { StudentsService } from './students.service';
// import { Student} from '@repo/database';
import { StudentOut,StudentUpdateIn, StudentCreateIn} from '@repo/api/index';
import { ZodPipe } from 'src/zod_pipe';
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtUser } from 'src/auth/jwt.strategy';
import { AuthGuard } from '@nestjs/passport';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
   
  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll(@CurrentUser() student: JwtUser): Promise<StudentOut[]> {
    console.log('User accessed:', student);
    return this.studentsService.findAll();
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string): Promise<StudentOut> {
    return this.studentsService.findOne(id);
  }
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: StudentUpdateIn,@CurrentUser() user: JwtUser): Promise<StudentOut> {
    return this.studentsService.update(id, updateStudentDto, user.sub);
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UsePipes(new ZodPipe(StudentCreateIn))
  // Unfortunately, a bug in Zod causes this to crash with heap out of memory
  // But at least we get some compile-time type-safety, if not runtime validation
  create(@Body() createStudentDto: StudentCreateIn, @CurrentUser() user: JwtUser): Promise<StudentOut> {

    return this.studentsService.create(createStudentDto, user.sub);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtUser):Promise<{ message: string }> {
    return this.studentsService.delete(id, user.sub);
  }
}