import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import {Instructor} from '@repo/database'

@Injectable()
export class InstructorsService {
    constructor(private prisma: PrismaService) {}

    async findAll(): Promise<Instructor[]> {
        return this.prisma.instructor.findMany({
        include: {
            user: true,
            sections: true,
        },
        });
    }

    async findOne(id: string): Promise<Instructor> {
    const instructor = await this.prisma.instructor.findUnique({
        where: { id: id },
        include: {
            user: true,
            sections: true,
        },
    });
    if (!instructor) {
        throw new NotFoundException(`Instructor with ID ${id} not found`);
    }
    return instructor;
    }
}           