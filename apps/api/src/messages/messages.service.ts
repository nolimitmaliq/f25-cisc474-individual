import { Message } from "@repo/database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Message[]> {
    return this.prisma.message.findMany();
  }

  async findOne(id: string): Promise<Message> {
    const message = await this.prisma.message.findUnique({
      where: { id: id},
        include: { course: true }
    });
    if (!message) {
      throw new NotFoundException(`Message with ID ${id} not found`);
    }
    return message;
  }
}