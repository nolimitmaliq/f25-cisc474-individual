import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Student} from '@repo/database';
import type { StudentOut,StudentCreateIn,StudentUpdateIn } from '@repo/api/index';

@Injectable()
export class StudentsService {
    constructor(private prisma: PrismaService) {}
    
    private mapStudentToDto(student: Student & { user: any; enrollments: any[]; submissions: any[] }): StudentOut {
        return {
            id: student.id,
            email: student.user.email,
            name: student.user.name,         
            lastname: student.user.lastname,  
            major: student.major,
            enrollments: student.enrollments.map((enr: any) => ({
                id: enr.id,
                enrollmentDate: enr.enrollmentDate,
                FinalGrade: enr.FinalGrade,
                course: {
                    id: enr.course.id,
                    title: enr.course.title,
                    code: enr.course.code,
                },
            })),
            submissions: student.submissions.map((sub: any) => ({
                id: sub.id,
                status: sub.status,
                grade: sub.grade,
            })),
        };
    }

    async create(createStudentDto: StudentCreateIn, authenticatedUserId: string): Promise<StudentOut> {
        const existingUser = await this.prisma.users.findUnique({
            where: { email: createStudentDto.email },
        });

        if (existingUser) {
            throw new ConflictException('A user with this email already exists');
        }

        const newStudent = await this.prisma.student.create({
            data: {
                major: createStudentDto.major,
                user: {
                    create: {
                        user_id: authenticatedUserId,
                        email: createStudentDto.email,
                        // password: createStudentDto.password,
                        name: createStudentDto.name,
                        lastname: createStudentDto.lastname,
                        role: 'Student',
                    },
                },
            },
            include: {
                user: true,
                enrollments: {
                    include: {
                        course: true,
                    },
                },
                submissions: true,
            },
        });
        
        return this.mapStudentToDto(newStudent);
    }

    async findOne(id: string): Promise<StudentOut> {
        const student = await this.prisma.student.findUnique({
            where: { id: id },
            include: {
                user: true,
                enrollments: {
                    include: {
                        course: true
                    },
                },
                submissions: true,
            },
        });
        
        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }
        
        return this.mapStudentToDto(student);
    }

    async findAll(): Promise<StudentOut[]> {
        const students = await this.prisma.student.findMany({
            include: {
                user: true,
                enrollments: {
                    include: {
                        course: true,
                    },
                },
                submissions: true,
            },
        });
        
        return students.map(student => this.mapStudentToDto(student));
    }
    async update(
        id: string,
        updateStudentDto: StudentUpdateIn,
        authenticatedUserId: string
    ): Promise<StudentOut> {
        const existingStudent = await this.prisma.student.findUnique({
            where: { id: id },
        });

        if (!existingStudent) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }

        // Perform the update
        const updatedStudent = await this.prisma.student.update({
            where: { id: id },
            data: {
                major: updateStudentDto.major,
                user: {
                    update: {
                        name: updateStudentDto.name,
                        lastname: updateStudentDto.lastname,
                        bio: updateStudentDto.bio,
                    },
                },
            },
            include: {
                user: true,
                enrollments: { 
                    include: { 
                        course: true 
                    } 
                },
                submissions: true,
            },
        });

        return this.mapStudentToDto(updatedStudent);
    }

    /**
     * Delete a student and their associated user record
     * NOTE: Authorization checks removed for demo purposes
     * In production, you would verify the user has permission to delete this student
     */
    async delete(id: string, authenticatedUserId: string): Promise<{ message: string }> {
        // Removed authorization check for demo purposes
        // In production, you'd check if user can delete this student

        // First, find the student to get their associated userId
        const student = await this.prisma.student.findUnique({
            where: { id: id },
            select: { userId: true },
        });

        if (!student) {
            throw new NotFoundException(`Student with ID ${id} not found`);
        }

        // Delete the Student record (this should cascade delete enrollments/submissions if configured)
        await this.prisma.student.delete({
            where: { id: id },
        });

        // Delete the associated User record
        await this.prisma.users.delete({
            where: { user_id: student.userId },
        });

        return { message: 'Student deleted successfully' };
    }
}