import {Get, Controller, Body, Param} from '@nestjs/common';
import { CoursesEnrolledService } from './coursesenrolleds.service';
import { CoursesEnrolled } from '@repo/database';

@Controller('coursesenrolleds')
export class CoursesEnrolledsController {
  constructor(private readonly coursesEnrolledService: CoursesEnrolledService) {}

  @Get()
  findAll(): Promise<CoursesEnrolled[]> {
    return this.coursesEnrolledService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<CoursesEnrolled> {
    return this.coursesEnrolledService.findOne(id);
  }
}