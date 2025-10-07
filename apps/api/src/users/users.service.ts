import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service'
import { Users,Role} from '@repo/database'

interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
  lastname?: string;
  bio?: string;
  role?: Role;
}

interface UpdateUserDto {
  email?: string;
  name?: string;
  lastname?: string;
  bio?: string;
  role?: Role;
}
@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto): Promise<Users> {
        try{
            const existingUser = await this.prisma.users.findUnique({
                where: {email:createUserDto.email}
            });
            if (existingUser){
                throw new ConflictException('Email already exists');
            }

            return await this.prisma.users.create({
                data: createUserDto,
                include: {
                    student: true,     // Include related data
                    Instructor: true,
                    Admin: true,
                },
            });
        } catch (error){
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new Error('Failed to create user');
        }
    }
    async findAll(): Promise<Users[]> {
        return this.prisma.users.findMany({
        include: {
            student: true,     // This fetches related Student data
            Instructor: true,  // This fetches related Instructor data  
            Admin: true,       // This fetches related Admin data
        },
        });
    }

    async findOne(id: string): Promise<Users> {
    const user = await this.prisma.users.findUnique({
      where: { user_id: id }, // Note: user_id instead of just id because of how it's defined in the model
      include: {
        student: true,
        Instructor: true,
        Admin: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<Users> {
    const user = await this.prisma.users.delete({
        where:{user_id:id},
        include: {
            student: true,
            Instructor: true,
            Admin: true,
        },
    });

    if(!user){
        throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<Users> {
    try{
        return await this.prisma.users.update({
            where: {user_id:id},
            data: updateUserDto,
            include: {
                student: true,
                Instructor: true,
                Admin: true,
            },
        });
    } catch (error) {
        if (typeof error === 'object' && error !== null && 'code' in error) {
            if ((error as any).code === 'P2025') {
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            if ((error as any).code === 'P2002') {
                throw new ConflictException('Email already exists');
            }
        }
        throw new Error('Failed to update user');
        
    }
  }

}