import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { CourseAssignment} from '@repo/database'

@Injectable()
export class CourseassignmentsService {
    constructor(private prisma: PrismaService) {}
    async findAll(): Promise<CourseAssignment[]> {
        return this.prisma.courseAssignment.findMany({
        include: {
            course: true,     // This fetches related Course data
            submissions: true,   // This fetches related Submissions data  
        },
        });
    }

    async findOne(id: string): Promise<CourseAssignment> {
    const courseAssignment = await this.prisma.courseAssignment.findUnique({
        where: { id: id },
        include: { course: true, submissions: true }, // Include related Course and Submissions data
    });
    if (!courseAssignment) {
        throw new NotFoundException(`CourseAssignment with ID ${id} not found`);
    }
    return courseAssignment;
    }
}