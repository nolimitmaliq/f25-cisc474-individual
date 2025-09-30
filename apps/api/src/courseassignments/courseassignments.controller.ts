import {Get, Controller,Param} from '@nestjs/common';
import {CourseassignmentsService} from './courseassignments.service'

@Controller('courseassignments')
export class CourseassignmentsController {
    constructor(private readonly courseassignmentsService: CourseassignmentsService) {}

    @Get()
    async findAll() {
        return this.courseassignmentsService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.courseassignmentsService.findOne(id);
    }
}