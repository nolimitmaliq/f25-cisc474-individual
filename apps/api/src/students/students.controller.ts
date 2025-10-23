import {Controller,Get,Post,Body,Patch,Param,Delete} from '@nestjs/common';
import { StudentsService } from './students.service';
// import { Student} from '@repo/database';
import type { StudentOut,StudentUpdateIn, StudentCreateIn} from '@repo/api/index';
import { ZodPipe } from 'src/zod_pipe';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}
  
  @Get()
  findAll(): Promise<StudentOut[]> {
    return this.studentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<StudentOut> {
    return this.studentsService.findOne(id);
  }
    @Patch(':id')
  update(@Param('id') id: string, @Body() updateStudentDto: StudentUpdateIn): Promise<StudentOut> {
    return this.studentsService.update(id, updateStudentDto);
  }

  @Post()
  //@UsePipes(new ZodPipe(CourseCreateIn))
  // Unfortunately, a bug in Zod causes this to crash with heap out of memory
  // But at least we get some compile-time type-safety, if not runtime validation
  create(@Body() createStudentDto: StudentCreateIn): Promise<StudentOut> {
    return this.studentsService.create(createStudentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string):Promise<{ message: string }> {
    return this.studentsService.delete(id);
  }
}