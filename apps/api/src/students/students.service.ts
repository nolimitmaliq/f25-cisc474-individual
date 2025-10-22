import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Student} from '@repo/database';
import type { StudentOut } from '@repo/api/index';

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
}