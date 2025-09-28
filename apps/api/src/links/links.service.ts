import { Injectable } from '@nestjs/common';

// import { Link } from '@repo/api/links/entities/link.entity';

import { CreateLinkDto } from '@repo/api/links/dto/create-link.dto';
import { UpdateLinkDto } from '@repo/api/links/dto/update-link.dto';
import { PrismaService } from '../prisma.service'
import { Link } from '@repo/database'

@Injectable()
export class LinksService {
  constructor(private prisma: PrismaService) {}
  // private readonly _links: Link[] = [
  // ];

  create(createLinkDto: CreateLinkDto) {
    return `This action adds a new link ${createLinkDto}`;
  }

  async findAll(): Promise<Link[]> {
    return this.prisma.link.findMany();
  }

  async findOne(id: number): Promise<Link | null> {
    const link = await this.prisma.link.findUnique({
      where: { id: Number(id) },
    });

    if (!link) {
      throw new Error(`Link with ID ${id} not found`);
    }
    return link;
  }

  update(id: number, updateLinkDto: UpdateLinkDto) {
    return `This action updates a #${id} link ${updateLinkDto}`;
  }

  remove(id: number) {
    return `This action removes a #${id} link`;
  }
}
