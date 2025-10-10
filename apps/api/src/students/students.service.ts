import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Student,Semester} from '@repo/database'

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Student[]> {
        return this.prisma.student.findMany({
            include: {  // Include related user data
                user: true,
                enrollments: true,
                submissions: true,
            },
        });
    }

    async findOne(id: string): Promise<Student> {
        const student = await this.prisma.student.findUnique({
            where: { id:id },
            include: {  // Include related user data
                user: true,     // This fetches related Users data
                enrollments: true,
                submissions: true,
            },
        });
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        return student;
    }
}