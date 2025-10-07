import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Admin} from '@repo/database'

@Injectable()
export class AdminsService {
    constructor(private prisma: PrismaService) {}
    async findAll(): Promise<Admin[]> {
        return this.prisma.admin.findMany({
        include: {
            user: true,     // This fetches related User data
        },
        });
    }

    async findOne(id: string): Promise<Admin> {
    const admin = await this.prisma.admin.findUnique({
        where: { id: id },
        include: { user: true }, // Include related User data
    });
    if (!admin) {
        throw new NotFoundException(`Admin with ID ${id} not found`);
    }
    return admin;
    }
}