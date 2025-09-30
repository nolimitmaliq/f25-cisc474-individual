import {Get, Controller,Param} from '@nestjs/common';
import {CourseassignmentService} from './courseassignment.service'

@Controller('courseassignment')
export class CourseassignmentController {
    constructor(private readonly courseassignmentService: CourseassignmentService) {}

    @Get()
    async findAll() {
        return this.courseassignmentService.findAll();
    }
    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.courseassignmentService.findOne(id);
    }
}