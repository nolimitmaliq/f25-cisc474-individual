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
  async create(createStudentDto: StudentCreateIn): Promise<StudentOut> {
        
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
                            email: createStudentDto.email,
                            password: createStudentDto.password,
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
    return students.map(this.mapStudentToDto);
  }

  async update(id: string,updateStudentDto: StudentUpdateIn,): Promise<StudentOut> {
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
          enrollments: { include: { course: true } },
          submissions: true,
        },
      });

      return this.mapStudentToDto(updatedStudent);
  }
  async delete(id: string): Promise<{ message: string }> {
    // 1. First, find the student to get their associated userId
    const student = await this.prisma.student.findUnique({
      where: { id: id },
      select: { userId: true }, // Only select the userId
    });

    if (!student) {
      throw new NotFoundException(`Student with ID ${id} not found`);
    }

    // 2. Delete the Student record
    await this.prisma.student.delete({
        where: { id: id },
    });
    await this.prisma.users.delete({
        where: { user_id: student.userId },
  });

      return { message: 'Student deleted successfully' };
  }
}
