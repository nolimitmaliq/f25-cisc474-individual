import {Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Course} from '@repo/database'
@Injectable()
export class CoursesService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Course[]> {
        return this.prisma.course.findMany({
            include:{
                assignments: true,
                announcements: true,
                sections: true,
                enrollments: true,
            }
        });
    }

    async findByID(id: string): Promise<Course> {
        const course = await this.prisma.course.findUnique({
          where: { id: id },
        });
        if (!course) {
          throw new NotFoundException(`Course with ID ${id} not found`);
        }
        return course;
    }

}