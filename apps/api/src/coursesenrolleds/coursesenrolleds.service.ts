import { CoursesEnrolled } from "@repo/database";
import { PrismaService } from '../prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CoursesEnrolledService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<CoursesEnrolled[]> {
    // for(const course of await this.prisma.coursesEnrolled.findMany()) {
    //     console.log(course);
    // }
    return this.prisma.coursesEnrolled.findMany({
        include:{
            student:true,
            course:true,
            section:true,
        }
    })
  }

  async findOne(id: string): Promise<CoursesEnrolled> {
    const course = await this.prisma.coursesEnrolled.findUnique({
      where: { id: id },
    });
    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }
    return course;
  }
}