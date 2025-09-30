import {Get, Controller,Post,Patch,Delete,Param,Body} from '@nestjs/common';
import { InstructorsService } from './instructors.service';
import { Instructor } from '@repo/database';

@Controller('instructors')
export class InstructorsController {
    constructor(private readonly instructorsService: InstructorsService) {}

    @Get()
    findAll(): Promise<Instructor[]> {
        return this.instructorsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Instructor> {
        return this.instructorsService.findOne(id);
    }
}