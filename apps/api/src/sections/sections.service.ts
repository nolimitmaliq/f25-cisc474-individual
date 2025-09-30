import {Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Section} from '@repo/database'

@Injectable()
export class SectionsService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Section[]> {
        return this.prisma.section.findMany({
            include:{
                enrollments: true,
                course: true,
                instructor: true,
            }
        });
    }
    async findOne(id: string): Promise<Section> {
        const section = await this.prisma.section.findUnique({
          where: { id: id },
          include:{
            enrollments: true,
            course: true,
            instructor: true,
        }
        });
        if (!section) {
          throw new NotFoundException(`Section with ID ${id} not found`);
        }
        return section;
    }

}