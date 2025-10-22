import {Controller,Get,Post,Body,Patch,Param,Delete} from '@nestjs/common';
import { StudentsService } from './students.service';
// import { Student} from '@repo/database';
import type { StudentOut } from '@repo/api/index';

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
}